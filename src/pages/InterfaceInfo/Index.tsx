import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Badge, Button, Card, Descriptions, Divider, Input, message} from "antd";
import {useParams} from "@@/exports";
import {
  getInterfaceInfoVoByIdUsingGet,
  invokeInterfaceInfoUsingPost
} from "@/services/simpleapi-backend/interfaceInfoController";
import ProCard from "@ant-design/pro-card";
import TextArea from "antd/es/input/TextArea";
import {
  applyInvokeCountUsingPost,
  listUserInterfaceInfoByPageUsingPost
} from "@/services/simpleapi-backend/userInterfaceInfoController";
import {getInitialState} from "@/app";

const Index: React.FC = () => {
  const [data, setData] = useState<API.InterfaceInfo>()
  const params = useParams();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [userInterfaceInfo, setUserInterfaceInfo] = useState<API.UserInterfaceInfo>()

  const loadData = async () => {
    const userState = await getInitialState()
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    try {
      const res = await getInterfaceInfoVoByIdUsingGet({
        id: Number(params.id),
      });
      const resMy = await listUserInterfaceInfoByPageUsingPost({
        userId: userState.loginUser?.id,
        interfaceInfoId: Number(params.id)
      })
      setData(res.data)
      setUserInterfaceInfo(resMy?.data?.records?.[0])
    } catch (error: any) {
      message.error('请求失败,' + error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async () => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPost({
        id: parseInt(params.id),
        requestParams: data?.requestParams,
      });
      setInvokeRes(res.data);
      message.success('调用成功')
      await loadData()
    } catch (error: any) {
      message.error('调用失败,' + error.message)
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer title="接口信息">
      <Card style={{maxWidth: 1024, margin: '0 auto'}} hoverable={true}>
        {data ? (
          <Descriptions title={data?.name} column={2}
                        extra={
                          <Button
                            onClick={async () => {
                              message.loading('申请中')
                              try {
                                await applyInvokeCountUsingPost({
                                  interfaceInfoId: Number(params.id)
                                })
                                message.destroy()
                                message.success('申请成功')
                                await loadData()
                              } catch (error: any) {
                                message.destroy()
                                message.error('申请失败')
                              }
                            }}
                          >
                            申请次数
                          </Button>
                        }
          >
            <Descriptions.Item label="接口状态">
              {data?.status === 0 ? <Badge status="default" text="关闭"/> : <Badge status="success" text="开启"/>}
            </Descriptions.Item>
            <Descriptions.Item label="描述">{data?.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data?.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data?.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data?.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data?.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data?.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="我的可用次数">{userInterfaceInfo?.leftNum ?? 0}</Descriptions.Item>
          </Descriptions>) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider/>
      <ProCard style={{maxWidth: 1024, margin: '0 auto'}} title="测试调用"
               extra={<Button onClick={onFinish} type={"primary"}>调用</Button>} hoverable={true} direction={"column"}>
        <Input style={{width: 800}} size={"large"}
               addonBefore={
                 data?.method
               }
               value={data?.url}
               disabled={true}
        />
        <br/>
        <br/>
        <TextArea disabled style={{width: 800}}
                  value={data?.requestParams}
        />
      </ProCard>
      <Divider/>
      <Card style={{maxWidth: 1024, margin: '0 auto'}} title="返回结果" loading={invokeLoading} hoverable={true}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
