// https://www.sanity.io/docs/structure-builder-cheat-sheet
// Note: Using any type for S parameter due to Sanity v3 type compatibility
export const structure = (S: any) => S.list().title('Content').items(S.documentTypeListItems());
