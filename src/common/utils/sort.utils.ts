type SortableField = 'firstName' | 'lastName' | 'email' | 'salary' | 'hireDate';

const allowedSortFields: SortableField[] = [
  'firstName',
  'lastName',
  'email',
  'salary',
  'hireDate',
];

export function isSortableField(field: string): field is SortableField {
  return allowedSortFields.includes(field as SortableField);
}
