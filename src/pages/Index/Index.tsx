import {PageContainer} from '@ant-design/pro-components';
import {Image, message, Spin, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {listInterfaceInfoVoByPageUsingPost} from "@/services/simpleapi-backend/interfaceInfoController";
import ProCard from "@ant-design/pro-card";
import Search from "antd/es/input/Search";
import {history} from "@umijs/max";
import {SearchOutlined} from "@ant-design/icons";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);

  const loadData = async ( description: string | undefined = undefined, current = 1, pageSize = 8) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoVoByPageUsingPost({
        description: description,
        current,
        pageSize
      })
      setList(res?.data?.records ?? []);
    } catch (error: any) {
      message.error('请求失败', error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const interfaceCard = list.map(item => {
    return (
      <ProCard hoverable key={item.id} colSpan={6} layout={"center"} direction={"column"} style={{height: 270}}
               onClick={() => history.push(`/interface_info/${item.id}`)}
      >
        <Image style={{width: 80, borderRadius: 8}}
               src={"https://img.qimuu.icu/typory/logo.gif"}
               preview={false}
        />
        <br/>
        <Typography.Title level={4}>{item.name}</Typography.Title>
        <br/>
        <Typography.Text>{item.description}</Typography.Text>
      </ProCard>
    )
  })
  return (
    <PageContainer title={false}>
      <Spin spinning={loading}>
        <ProCard
          style={{maxWidth: 1024, margin: "0 auto", height: 150}}
          layout={"center"}
          direction={"column"}
        >
          <Typography.Title level={3}>接口中心</Typography.Title>
          <Search
            style={{maxWidth: 700}}
            placeholder="搜索你心仪的接口吧！"
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={(value) => loadData(value)}
          />
        </ProCard>
        <br/>
        <br/>
        <ProCard
          ghost
          style={{maxWidth: 1024, margin: "0 auto"}}
          gutter={[20, 20]}
          wrap
        >
          {interfaceCard}
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default Index;
