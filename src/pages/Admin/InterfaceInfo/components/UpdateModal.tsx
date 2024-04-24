import {ProColumns, ProFormInstance, ProTable,} from '@ant-design/pro-components';
import '@umijs/max';
import React, {useEffect, useRef} from 'react';
import {Modal} from "antd";

export type Props = {
  values: API.InterfaceInfo
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => void
  visible: boolean
};

const UpdateForm: React.FC<Props> = (props) => {
  const {columns, visible, onCancel, onSubmit, values} = props
  const formRef = useRef<ProFormInstance>()
  useEffect(() => {
    if (formRef) {
      formRef.current?.setFieldsValue(values);
    }
  })
  return (
    <Modal open={visible} onCancel={() => onCancel?.()} footer={null}>
      <ProTable
        type="form"
        formRef={formRef}
        columns={columns}
        onSubmit={async (values) => {
          onSubmit?.(values);
        }}

      />
    </Modal>
  );
};
export default UpdateForm;
