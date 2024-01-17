export interface deptV0 extends BaseEntity {
  id: string | number;
  deptCode: string;
  deptName: string;
  deptShortName: string;
  sort: number;
  isEnable: string | number;
}
