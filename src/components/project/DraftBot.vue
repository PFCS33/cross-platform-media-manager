<template>
  <div class="draft-box" v-loading="loading || deleteLoading">
    <el-dialog
      class="publish-panel-card draft-mode"
      destroy-on-close
      v-model="showEditPanel"
      :show-close="false"
    >
      <template #header>
        <div class="title-box">
          <h1 class="title">EDIT YOUR POST</h1>
          <div class="time-box">
            <div class="fixed-time">
              <el-date-picker
                v-model="selecedDate"
                type="date"
                placeholder="Pick a day"
                :disabled-date="disabledDate"
              />
            </div>
            <div class="accurate-time">
              <el-time-select
                v-model="selecedAccurateTime"
                start="00:00"
                step="00:01"
                end="24:00"
                placeholder="Select time"
              />
            </div>
          </div>
        </div>
      </template>
      <PublishPanel></PublishPanel>
      <template #footer>
        <span class="dialog-footer">
          <BaseButton class="button cancle" @click="showEditPanel = false"
            >Cancel</BaseButton
          >
          <BaseButton class="button confirm" @click="showEditPanel = false">
            Publish
          </BaseButton>
        </span>
      </template>
    </el-dialog>
    <div class="button-box">
      <transition name="pull">
        <div v-if="deleteMode">
          <BaseButton @click="deleteDrafts(selectedCards)" class="confirm-btn"
            >Confirm</BaseButton
          >
        </div>
      </transition>
      <BaseButton
        @click="toggleDeleteMode"
        :class="['btn', { selected: deleteMode }]"
        >BULK DELETE</BaseButton
      >
    </div>
    <div class="content-box" v-if="showContent" ref="selection-area">
      <div
        v-if="isSelecting"
        class="selection-box"
        :style="{
          left: selectionBox.x + 'px',
          top: selectionBox.y + 'px',
          width: selectionBox.width + 'px',
          height: selectionBox.height + 'px',
        }"
      ></div>
      <transition-group tag="div" name="list" class="card-box">
        <div
          class="card-wrapper"
          v-for="(draftData, index) in currentPageData"
          :key="draftData.id"
        >
          <BaseCard class="draft-card">
            <span class="title">{{ draftData.title }}</span>
            <div class="tags-box">
              <el-tag
                class="tag"
                v-for="tag in draftData.topics"
                :key="tag"
                :disable-transitions="false"
              >
                #{{ tag }}
              </el-tag>
            </div>
            <div class="time-box">
              <span class="label">Last edited: </span>
              <span class="time">{{
                draftData.last_edit_time.split(" ")[0]
              }}</span>
              <span class="time">{{
                draftData.last_edit_time.split(" ")[1]
              }}</span>
            </div>
            <div class="time-box">
              <span class="label">Scheduled time: </span>
              <span class="time">{{
                draftData.scheduled_time.split(" ")[0]
              }}</span>
              <span class="time">{{
                draftData.scheduled_time.split(" ")[1]
              }}</span>
            </div>
            <div class="blank"></div>
            <div class="btn-box">
              <BaseButton
                :disabled="deleteMode"
                class="btn"
                @click="deleteDraft(index)"
                >Delete</BaseButton
              >
              <BaseButton
                class="confirm btn"
                @click="openEditPanel(draftData.id)"
                >Edit & Publish</BaseButton
              >
            </div>
            <SvgIcon iconName="check" class="check-icon"></SvgIcon>
          </BaseCard>
        </div>
      </transition-group>
      <div class="pagination-box">
        <el-pagination
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="drafts.length"
          v-model:current-page="currentPage"
          class="draft-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PublishPanel from "@/components/project/publish/PublishPanel.vue";
export default {
  components: {
    PublishPanel,
  },
  data() {
    return {
      // edit
      selecedDate: null,
      selecedAccurateTime: null,

      showEditPanel: false,
      initialFlag: true,

      deleteMode: false,
      pageSize: 4,
      currentPage: 1,
      currentPageData: null,
      showContent: false,

      // selection
      selcetoinEventHandlers: {
        mousedown: null,
        mousemove: null,
        mouseup: null,
      },
      isSelecting: false,
      selectionBox: { x: 0, y: 0, width: 0, height: 0 },
      selectedCards: [],
    };
  },
  watch: {
    deleteResult(newVal) {
      if (newVal) {
        const selectedIds = this.selectedCards.map(
          (index) => this.currentPageData[index].id
        );

        const filteredDrafts = this.drafts.filter(
          (draft) => !selectedIds.includes(draft.id)
        );

        this.$store.commit("draft/setDrafts", filteredDrafts);

        this.deleteMode = false;
      }
    },
    deleteMode(newVal) {
      if (!newVal) {
        // 清除所有卡片的选中状态
        const cards = this.$el.querySelectorAll(".draft-card");
        cards.forEach((card) => {
          card.classList.remove("selected");
        });
        this.selcetedCards = [];
      }
    },

    drafts(newVal) {
      if (newVal) {
        if (this.initialFlag) {
          this.currentPageData = this.getPageDataByNumber(this.currentPage);
          this.showContent = true;
          this.$nextTick(() => {
            this.setupEventListeners();
          });
          this.initialFlag = false;
        } else {
          this.currentPageData = this.getPageDataByNumber(this.currentPage);
        }
      }
    },
    currentPage(newVal) {
      this.currentPageData = this.getPageDataByNumber(newVal);
    },
    error(newVal) {
      if (newVal.state) {
        ElMessage.error(`Error: ${newVal.message}`);
        setTimeout(() => ElMessage.error("Please try again"), 500);
      } else {
        ElMessage.success(`${newVal.message}`);
      }
    },
    deleteError(newVal) {
      if (newVal.state) {
        ElMessage.error(`Error: ${newVal.message}`);
        setTimeout(() => ElMessage.error("Please try again"), 500);
      } else {
        ElMessage.success(`${newVal.message}`);
      }
    },
  },
  mounted() {
    this.$store.dispatch("draft/getDraftsInfo");
  },
  beforeDestroy() {
    this.removeEventListeners();
  },
  computed: {
    drafts() {
      return this.$store.getters["draft/drafts"];
    },
    deleteResult() {
      return this.$store.getters["draft/deleteResult"];
    },
    loading() {
      return this.$store.getters["draft/draftsLoading"];
    },
    error() {
      return this.$store.getters["draft/draftsError"];
    },

    deleteLoading() {
      return this.$store.getters["draft/deleteLoading"];
    },
    deleteError() {
      return this.$store.getters["draft/deleteError"];
    },
  },
  methods: {
    disabledDate(time) {
      return time.getTime() < Date.now();
    },
    openEditPanel(id) {
      this.showEditPanel = true;
    },
    deleteDraft(index) {
      this.selectedCards.push(index);
      this.deleteDrafts([index]);
    },
    deleteDrafts(indexs) {
      this.$store.commit("draft/setDeleteResult", null);
      const selectedIds = indexs.map((index) => this.currentPageData[index].id);

      this.$store.dispatch("draft/deleteDraft", { selectedIds: selectedIds });
    },
    setupEventListeners() {
      const contentBox = this.$refs["selection-area"];
      // 初始化并绑定事件处理器
      this.selcetoinEventHandlers.mousedown = this.handleMouseDown.bind(this);
      this.selcetoinEventHandlers.mousemove = this.handleMouseMove.bind(this);
      this.selcetoinEventHandlers.mouseup = this.handleMouseUp.bind(this);

      contentBox.addEventListener(
        "mousedown",
        this.selcetoinEventHandlers.mousedown
      );
      document.addEventListener(
        "mousemove",
        this.selcetoinEventHandlers.mousemove
      );
      document.addEventListener("mouseup", this.selcetoinEventHandlers.mouseup);
    },
    removeEventListeners() {
      const contentBox = this.$refs["selection-area"];
      // 移除事件监听器
      if (contentBox) {
        contentBox.removeEventListener(
          "mousedown",
          this.selcetoinEventHandlers.mousedown
        );
      }
      document.removeEventListener(
        "mousemove",
        this.selcetoinEventHandlers.mousemove
      );
      document.removeEventListener(
        "mouseup",
        this.selcetoinEventHandlers.mouseup
      );
    },

    handleMouseDown(event) {
      if (!this.deleteMode) return;
      this.isSelecting = true;
      const contentBoxRect =
        this.$refs["selection-area"].getBoundingClientRect();
      this.selectionBox = {
        x: event.clientX - contentBoxRect.left,
        y: event.clientY - contentBoxRect.top,
        width: 0,
        height: 0,
      };
      // 清除所有卡片的选中状态
      const cards = this.$el.querySelectorAll(".draft-card");
      cards.forEach((card) => {
        card.classList.remove("selected");
      });

      // 重置选中卡片的数组
      this.selectedCards = [];
    },
    handleMouseMove(event) {
      if (!this.isSelecting) return;
      const contentBoxRect =
        this.$refs["selection-area"].getBoundingClientRect();
      this.selectionBox.width =
        event.clientX - contentBoxRect.left - this.selectionBox.x;
      this.selectionBox.height =
        event.clientY - contentBoxRect.top - this.selectionBox.y;
    },
    handleMouseUp() {
      if (!this.isSelecting) return;
      this.isSelecting = false;
      const selectedCards = [];
      // 根据 selectionBox 确定哪些 card-box 被选中，并更新 selectedCards 数组
      const contentBoxRect =
        this.$refs["selection-area"].getBoundingClientRect();
      // 选择框的绝对位置边界
      const selectionRect = {
        left: this.selectionBox.x + contentBoxRect.left,
        top: this.selectionBox.y + contentBoxRect.top,
        right:
          this.selectionBox.x + contentBoxRect.left + this.selectionBox.width,
        bottom:
          this.selectionBox.y + contentBoxRect.top + this.selectionBox.height,
      };
      // 获取所有的卡片元素
      const cards = this.$el.querySelectorAll(".draft-card");
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();

        // 检查卡片是否与选择框相交
        const intersects =
          cardRect.left < selectionRect.right &&
          cardRect.right > selectionRect.left &&
          cardRect.top < selectionRect.bottom &&
          cardRect.bottom > selectionRect.top;

        if (intersects) {
          // 如果相交，添加到 selectedCards 数组
          selectedCards.push(index);
          // 添加样式
          card.classList.add("selected");
        }
      });
      this.selectedCards = selectedCards;
    },
    getPageDataByNumber(pageNum) {
      const start = this.pageSize * (pageNum - 1);
      let end = start + this.pageSize;
      // if (end > this.insightList.length) end = this.insightList.length;
      return this.drafts.slice(start, end);
    },
    toggleDeleteMode() {
      this.deleteMode = !this.deleteMode;
    },
  },
};
</script>

<style lang="scss" scoped>
@include pull-animation(1.5rem);
@include list-column-animation();
.draft-box {
  @include container-base();
  @include flex-box(column);
  padding: 2rem;
  padding-bottom: 1rem;

  .button-box {
    width: 100%;
    user-select: none;
    @include flex-box(row);
    justify-content: end;
    align-items: center;
    gap: 1rem;

    .btn {
      width: fit-content;
      border-radius: 1.2rem;
      box-shadow: 0.15rem 0.3rem 0.2rem 0rem rgba(0, 0, 0, 0.26);
      transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out,
        color 0.2s ease-out;

      &:hover {
        cursor: pointer;
        background-color: $secondary-color-dark;
        color: $primary-color;
      }

      &.selected {
        background-color: $secondary-color-dark;
        box-shadow: inset 0.3rem 0.3rem 0.5rem 0.4rem rgba(0, 0, 0, 0.423);
        color: $primary-color;
      }
    }

    .confirm-btn {
      width: fit-content;
      border-radius: 1.2rem;
      box-shadow: 0.15rem 0.3rem 0.2rem 0rem rgba(0, 0, 0, 0.26);
      transition: background-color 0.2s ease-out, box-shadow 0.2s ease-out,
        color 0.2s ease-out;
      color: $third-color-light;

      &:hover {
        cursor: pointer;
        background-color: $secondary-color-dark;
        color: $third-color-light;
      }
    }
  }
  .content-box {
    position: relative;
    width: 100%;
    flex: 1 1 auto;
    @include flex-box(column);

    .card-box {
      flex: 1 0 auto;

      @include flex-center(row);
      justify-content: start;
      gap: 2rem;
      // gap: 2rem;
      .card-wrapper {
        height: 65%;
        width: 25%;
        .draft-card {
          width: 100%;
          height: 100%;
          position: relative;

          user-select: none;
          border-radius: 1rem;
          background-color: $secondary-color;
          color: $background-color;
          @include flex-box(column);
          padding: 2rem 2rem 1.2rem 2rem;
          gap: 1rem;

          transition: background-color 0.2s ease-out, transform 0.2s ease-out,
            border 0.2s ease-out, box-shadow 0.15s ease-out;
          &:hover {
            transform: scale(1.05);
            background-color: $secondary-color-dark;
            box-shadow: 0.6rem 0.4rem 0.8rem rgba($secondary-color-dark, 0.6);
          }

          &.selected {
            // border: 0.4rem solid $primary-color;
            .check-icon {
              opacity: 1;
            }
          }

          .check-icon {
            position: absolute;
            top: 0;
            right: 0;
            opacity: 0;
            transition: opacity 0.2s ease-out;
            @include icon-style($icon-size-large, $primary-color);
          }

          .title {
            color: $primary-color;
            font-weight: $font-weight-bold;
            font-size: 1.8rem;
            // margin-bottom: 0.4rem;
          }
          .tags-box {
            flex-wrap: wrap; /* 当子元素超出容器宽度时换行 */
            @include flex-box(row);
            align-items: center;
            gap: 0.4rem;
            margin-bottom: 1.5rem;
          }
          .blank {
            flex: auto;
          }

          .time-box {
            @include flex-box(row);
            gap: 0.8rem;
            align-items: center;
            .label {
              font-size: 1.3rem;
            }
            .time {
              font-size: 1.2rem;
              background-color: $secondary-color-dark;
              color: $third-color-light;
              padding: 0.3rem 0.5rem;
              border-radius: 0.8rem;
            }
          }
          .btn-box {
            @include flex-box(row);
            align-items: center;
            justify-content: center;
            gap: 2rem;

            .btn {
              background-color: $primary-color;
              color: $secondary-color;
              border-radius: 1rem;

              &:hover {
                background-color: $primary-color-dark;
                color: $primary-color;
              }
              &:disabled {
                cursor: not-allowed;
                background-color: $primary-color-dark;
                color: $secondary-color;
              }
              &.confirm {
                background-color: $third-color;
                color: $background-color;

                &:hover {
                  background-color: $third-color-dark;
                  color: $background-color-white;
                }
              }
            }
          }
        }
      }
    }

    .pagination-box {
      @include flex-center(row);
    }

    .selection-box {
      position: absolute;
      border: 0.2rem dashed $third-color;
      background-color: rgba($primary-color, 0.6);
      z-index: 10;
    }
  }
}
</style>

<style lang="scss">
.draft-box {
  .draft-card {
    .tags-box {
      .el-tag {
        --el-tag-bg-color: #{$secondary-color-dark};
        --el-tag-border-color: #{$secondary-color};

        --el-tag-text-color: #{$primary-color};
      }
    }
  }
}

.el-pagination.draft-pagination {
  --el-color-primary: #{$secondary-color};
  --el-text-color-primary: #{$secondary-color};
}

.el-dialog.publish-panel-card.draft-mode {
  .el-dialog__header {
    .time-box {
      .fixed-time {
        padding: 0;
        background-color: $background-color-white;
        border-radius: 0.4rem;
      }
    }
  }
}
.el-date-picker {
  --el-color-primary: #{$secondary-color};
}
</style>
