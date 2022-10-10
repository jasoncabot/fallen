// In production the browser sends the CF_Authorization cookie automatically and
// the Worker verifies the Cloudflare Access JWT. No token management needed.
//
// In development (DEV=true in .dev.vars) the Worker accepts a Bearer token as a
// fallback, so we use a deterministic ID to keep local identity stable.
//
// Override with VITE_DEV_USER_ID when you want to emulate multiple dev users.

const STORAGE_KEY = 'fallen_dev_token';
const PERSON_NAME_KEY = 'name';
const DEFAULT_DEV_USER_ID = 'dev-user-local';

export interface Person {
  id: string;
  name: string;
}

export const devToken = (): string => {
  const configured = import.meta.env.VITE_DEV_USER_ID as string | undefined;
  const preferredToken = configured && configured.trim().length > 0 ? configured.trim() : DEFAULT_DEV_USER_ID;

  let token = localStorage.getItem(STORAGE_KEY);
  if (token !== preferredToken) {
    token = preferredToken;
    localStorage.setItem(STORAGE_KEY, preferredToken);
  }
  return token;
};

export const person = (): Person => ({
  id: devToken(),
  name: localStorage.getItem(PERSON_NAME_KEY) ?? ''
});

export const setPerson = (value: Person): void => {
  localStorage.setItem(PERSON_NAME_KEY, value.name);
};
