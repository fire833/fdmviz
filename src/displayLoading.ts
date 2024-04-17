import { loadingMessages } from './stores';

// Executes the given callback, displaying the loadingMessage while the callback executes.
export async function displayLoading(
  callback: () => any,
  loadingMessage: String,
) {
  startLoading(loadingMessage);
  await callback();
  clearLoading(loadingMessage);
}

export function startLoading(loadingMessage: String) {
  // Add loading message
  loadingMessages.update((array: String[]) => {
    array.push(loadingMessage);
    return array;
  });
}

export function clearLoading(loadingMessage: String) {
  // Remove loading message
  loadingMessages.update((array: String[]) => {
    let newArray = new Array<String>();
    array.forEach((value: String) => {
      if (value != loadingMessage) {
        newArray.push(value);
      }
    });
    return newArray;
  });
}
