import { LoginRequest } from "../_types";

export const toBase64 = (input: string): string => Buffer.from(input).toString('base64');
export const fromBase64 = (input: string): string => Buffer.from(input, 'base64').toString('ascii');
export const encodeRequest = (input: LoginRequest): string => toBase64(JSON.stringify(input));
export const decodeRequest = (input: string): LoginRequest => JSON.parse(fromBase64(input)) as LoginRequest;