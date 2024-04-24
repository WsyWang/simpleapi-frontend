import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Descriptions, message, Space, Typography} from "antd";
import {EyeInvisibleOutlined, EyeOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";
import {getInitialState} from "@/app";
import UserUpdateModal from "@/pages/User/Personal/components/UserUpdateModal";
import {updateKeyUsingPost, updateMyUserUsingPost} from "@/services/simpleapi-backend/userController";

const {Paragraph} = Typography;

const Index: React.FC = () => {
  const [data, setData] = useState<API.LoginUserVO>();
  const [visible, setVisible] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);

  const loadData = async () => {
    const initialState = await getInitialState()
    setData(initialState.loginUser);
  }

  useEffect(() => {
    loadData()
  }, []);

  return (
    <PageContainer title={false}>
      <Card style={{maxWidth: 1050, margin: "0 auto"}}>
        <Card type="inner" title="个人信息" extra={
          <>
            <Space>
              <Button onClick={() => setVisible(true)} type={"primary"}>修改信息</Button>
            </Space>
          </>
        }>
          <Descriptions column={1}>
            <Descriptions.Item>
              <Avatar size={128} src={data?.userAvatar}/>
            </Descriptions.Item>
            <Descriptions.Item label={"用户昵称"}>
              {data?.userName ?? '暂无'}
            </Descriptions.Item>
            <Descriptions.Item label={"用户编号"}>
              {data?.id ?? '暂无'}
            </Descriptions.Item>
            <Descriptions.Item label={"用户简介"}>
              {data?.userProfile ?? '暂无'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          style={{marginTop: 16}}
          type="inner"
          title={"开发者密钥"}
          extra={
            <>
              <Space>
                <Button onClick={() => setKeyVisible(() => !keyVisible)} size={"small"} type={"primary"}
                        shape={"circle"}>
                  {keyVisible ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                </Button>
                <Button
                  loading={keyLoading}
                  type={"primary"}
                  onClick={async () => {
                    message.loading('生成密钥中...')
                    setKeyLoading(true);
                    try {
                      await updateKeyUsingPost();
                      await loadData();
                      message.destroy()
                      message.success('生成成功')
                    } catch (error: any) {
                      message.error('生成失败,' + error.message)
                    }
                    setKeyLoading(false);
                  }}
                >
                  更新密钥
                </Button>
              </Space>
            </>
          }
        >
          <Descriptions column={1}>
            <Descriptions.Item label={"accessKey"}>
              {keyVisible ?
                <Paragraph copyable>{data?.accessKey ?? '暂无'}</Paragraph>
                : <Paragraph>⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐</Paragraph>
              }
            </Descriptions.Item>
            <Descriptions.Item label={"secretKey"}>
              {keyVisible ?
                <Paragraph copyable> {data?.secretKey ?? '暂无'}</Paragraph>
                : <Paragraph>⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐</Paragraph>
              }
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          style={{marginTop: 16}}
          type="inner"
          title="SDK调用"
        >
          <Button>
            <VerticalAlignBottomOutlined/>
            Java SDK
          </Button>
        </Card>
      </Card>
      <UserUpdateModal visible={visible} onCancel={() => setVisible(false)} data={data ?? {}}
                       onFinish={async (values: API.LoginUserVO) => {
                         message.loading('更新中');
                         try {
                           await updateMyUserUsingPost({
                             ...values
                           })
                           message.destroy()
                           message.success('更新成功');
                         } catch (error: any) {
                           message.error('更新失败,' + error.message);
                         }
                         await loadData()
                         setVisible(false);
                       }}/>
    </PageContainer>
  );
};

export default Index;
