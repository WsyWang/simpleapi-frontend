import {ProColumns, ProTable,} from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
import {Modal} from "antd";

export type Props = {
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => void
  visible: boolean
};

const UpdateForm: React.FC<Props> = (props) => {
  const {columns, visible, onCancel, onSubmit} = props
  return (
    <Modal open={visible} onCancel={() => onCancel?.()} footer={null}>
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (values) => {
          onSubmit?.(values);
        }}
      />
    </Modal>
  );
};
export default UpdateForm;
