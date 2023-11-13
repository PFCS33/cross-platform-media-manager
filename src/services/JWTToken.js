function decodeJwtPayload(token) {
  const base64Payload = token.split(".")[1];
  const decodedPayload = atob(base64Payload);
  return JSON.parse(decodedPayload);
}

export { decodeJwtPayload };
