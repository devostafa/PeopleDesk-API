type DeptSortableField = 'name';

const allowedDeptSortFields: DeptSortableField[] = ['name'];

export function isDeptSortableField(field: string): field is DeptSortableField {
  return allowedDeptSortFields.includes(field as DeptSortableField);
}
