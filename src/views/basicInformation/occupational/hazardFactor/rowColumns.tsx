import { FormRules } from 'element-plus';

/**
 * 必检项目 / 目标职业病 / 职业禁忌症
 */
export const tableColumns = ({ bus_duty_status, bus_shine_source, bus_job_illumination_source, tab = '1', sortCode = '' }: any) => {
  const MyEnum: any = {
    '1': { name: '必检项目', prop: 'itemName' },
    '2': { name: '目标职业病', prop: 'itemName' },
    '3': { name: '职业禁忌症', prop: 'itemName' },
    '4': { name: '症状询问重点', prop: 'symptomFocus' },
    '5': { name: '体格检查', prop: 'physicalExamination' },
    '6': { name: '检查周期', prop: 'inspectionCycle' }
  };
  return [
    {
      type: 'selection',
      prop: 'selection'
    },
    {
      label: '危害因素编号',
      prop: 'hazardFactorsCode',
      fixed: 'left'
    },
    {
      label: '危害因素名称',
      prop: 'hazardFactorsName',
      fixed: 'left'
    },
    {
      label: '在岗状态',
      prop: 'dutyStatus',
      enum: bus_duty_status
    },
    {
      label: '照射源',
      prop: 'shineSource',
      enum: bus_shine_source,
      isShow: sortCode === '14' && tab == '1' ? true : false
    },
    {
      label: '职业照射种类',
      prop: 'shineType',
      enum: bus_job_illumination_source,
      isShow: sortCode === '14' && tab == '1' ? true : false
    },
    {
      label: MyEnum[tab]?.name || '必检项目',
      prop: MyEnum[tab]?.prop || 'itemName',
      width: 150
    },
    {
      label: '最后编辑人',
      prop: 'updateByName'
    },
    {
      label: '最后编辑时间',
      prop: 'updateTime'
    },
    {
      label: '操作',
      prop: 'operation',
      width: 150,
      fixed: 'right'
    }
  ];
};

export const formFields = ({ bus_duty_status, options = [], tab = '1', sortCode = '' }: any) => {
  return [
    {
      label: '危害因素名称',
      prop: 'hazardFactorsName',
      search: {
        el: 'select',
        props: {
          clearable: false,
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: '危害因素编号',
      prop: 'hazardFactorsCode',
      search: {
        el: 'input',
        props: {
          disabled: true,
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: '在岗状态',
      prop: 'dutyStatus',
      enum: bus_duty_status,
      search: {
        el: 'select',
        props: {
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: '照射源',
      prop: 'shineSource',
      isShowSearch: sortCode === '14' && tab == '1' ? true : false
    },
    {
      label: '职业照射种类',
      prop: 'shineType',
      isShowSearch: sortCode === '14' && tab == '1' ? true : false
    },
    {
      label: tab === '1' ? '必检项目' : tab === '2' ? '目标职业病' : '职业禁忌症',
      prop: 'itemList',
      enum: options,
      isShowSearch: true,
      search: {
        el: 'select',
        props: {
          filterable: true,
          multiple: true,
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: tab === '1' ? '已选必检项目' : '已选职业病',
      prop: 'selectItemList',
      isShowSearch: true,
      search: {
        render: ({ searchParam }: any) => {
          const handleCloseTag = (tag: any) => {
            searchParam.itemList?.splice(searchParam.itemList.indexOf(tag), 1);
          };
          return (
            <>
              <div class="w-120% h-120px px-8px py-4px rounded-4px border border-solid border-#E6EAEF">
                {searchParam.itemList?.map((item: string) => {
                  const label = unref(options).find((val: any) => val?.value == item)?.label;
                  return (
                    <el-tag closable class="mr-8px" onClose={(item: any) => handleCloseTag(item)}>
                      {item + ' ' + label}
                    </el-tag>
                  );
                })}
              </div>
            </>
          );
        },
        props: { type: 'textarea' }
      }
    },
    {
      label: ' 启用状态',
      prop: 'enableStatus',
      component: 'Switch',
      search: { el: 'switch', props: { 'active-value': '0', 'inactive-value': '1' } }
    }
  ];
};

export const otherFields = ({ bus_duty_status, tab }: any) => {
  return [
    {
      label: '危害因素名称',
      prop: 'hazardFactorsName',
      search: {
        el: 'select',
        props: {
          clearable: false,
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: '危害因素编号',
      prop: 'hazardFactorsCode',
      search: {
        el: 'input',
        props: {
          disabled: true,
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: '在岗状态',
      prop: 'dutyStatus',
      enum: bus_duty_status,
      search: {
        el: 'select',
        props: {
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: tab === '4' ? '症状询问重点' : tab === '5' ? '体格检查' : '检查周期',
      prop: tab === '4' ? 'symptomFocus' : tab === '5' ? 'physicalExamination' : 'inspectionCycle',
      search: { el: 'input', props: { type: 'textarea' } }
    },
    {
      label: ' 启用状态',
      prop: 'enableStatus',
      component: 'Switch',
      search: { el: 'switch', props: { 'active-value': '0', 'inactive-value': '1' } }
    }
  ];
};
/**
 * 评价标准
 */
export const pjFields = () => {
  return [
    {
      label: '危害因素名称',
      prop: 'hazardFactorsName',
      search: {
        el: 'select',
        props: {
          clearable: false,
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: '危害因素编号',
      prop: 'hazardFactorsCode',
      search: {
        el: 'select',
        props: {
          clearable: false,
          disabled: true,
          style: {
            width: '70%'
          }
        }
      }
    },
    {
      label: '评价标准',
      prop: 'evaluationCriterion',
      search: {
        el: 'input',
        props: {
          type: 'textarea'
        }
      }
    }
  ];
};

export const rules = reactive<FormRules>({
  hazardFactorsName: [{ required: true, message: '请选择危害因素名称', trigger: 'change' }],
  hazardFactorsCode: [{ required: true, message: '请输入危害因素编号', trigger: 'blur' }],
  dutyStatus: [{ required: true, message: '请选择在岗状态', trigger: 'change' }],
  shineSource: [{ required: true, message: '请选择照射源', trigger: 'change' }],
  shineType: [{ required: true, message: '请选择职业照射种类', trigger: 'change' }],
  itemList: [{ type: 'array', required: true, message: '请选择必检项目', trigger: 'change' }],
  symptomFocus: [{ required: true, message: '请输入症状询问重点', trigger: 'blur' }],
  physicalExamination: [{ required: true, message: '请输入体格检查', trigger: 'blur' }],
  inspectionCycle: [{ required: true, message: '请输入检查周期', trigger: 'blur' }],
  enableStatus: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
  evaluationCriterion: [{ required: true, message: '请输入评价标准', trigger: 'blur' }]
});
