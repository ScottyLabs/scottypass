export default function isDomainAllowed(allowedDomains: string[], domain: string): boolean {
  for (const allowedDomain of allowedDomains) {
    if (domain.match(`^${allowedDomain}`) !== null) {
      return true;
    }
  }
  return false;
}
