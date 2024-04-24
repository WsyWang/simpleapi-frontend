import '@umijs/max';
import React from 'react';
import {Modal} from "antd";
import {ProForm, ProFormTextArea} from "@ant-design/pro-form";
import {ProFormText} from "@ant-design/pro-components";

export type Props = {
  visible: boolean,
  onCancel: () => void
  data: API.LoginUserVO
  onFinish: (values: API.LoginUserVO) => void
};

const UpdateForm: React.FC<Props> = (props) => {
  const {data, visible, onCancel, onFinish} = props;
  return (
    <Modal open={visible} onCancel={() => onCancel?.()} footer={null}>
      <ProForm onFinish={(values: API.LoginUserVO) => onFinish?.(values)}>
        <ProFormText disabled={true} name="id" label={"用户编号"} initialValue={data.id}/>
        <ProFormText rules={[{required: true}]} name="userName" label={"用户昵称"} initialValue={data.userName}/>
        <ProFormTextArea name="userProfile" label={"用户简介"} initialValue={data.userProfile}/>
      </ProForm>
    </Modal>
  );
};
export default UpdateForm;
