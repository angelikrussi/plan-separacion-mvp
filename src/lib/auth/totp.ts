import { authenticator } from "otplib";

export function generarSecretoTotp() {
  return authenticator.generateSecret();
}

export function totpUri(correo: string, secret: string) {
  return authenticator.keyuri(correo, process.env.TOTP_ISSUER ?? "Principal", secret);
}

export function verificarTotp(codigo: string, secret: string) {
  try {
    return authenticator.verify({ token: codigo, secret });
  } catch {
    return false;
  }
}
