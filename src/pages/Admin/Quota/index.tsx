import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {PageContainer, ProDescriptions, ProTable,} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import CreateModal from "@/pages/Admin/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";
import {
  addUserInterfaceInfoUsingPost,
  banUsingPost,
  deleteUserInterfaceInfoUsingPost,
  listUserInterfaceInfoByPageUsingPost,
  notBanUsingPost,
  updateUserInterfaceInfoUsingPost
} from "@/services/simpleapi-backend/userInterfaceInfoController";


const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.UserInterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      const res = await addUserInterfaceInfoUsingPost({
        ...fields,
      });
      if (res.data) {
        hide();
        message.success('创建成功');
        handleModalOpen(false);
      }
      return true;
    } catch (error: any) {
      hide();
      message.error('添加失败,' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.UserInterfaceInfo) => {
    const hide = message.loading('修改中');
    try {
      await updateUserInterfaceInfoUsingPost({
        id: currentRow?.id,
        ...fields
      });
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败');
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.UserInterfaceInfo) => {
    const hide = message.loading('正在删除');
    try {
      await deleteUserInterfaceInfoUsingPost({
        id: record.id
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload()
      return true;
    } catch (error) {
      hide();
      message.error('删除失败');
      return false;
    }
  };

  /**
   *  ban
   * @zh-CN 封禁
   *
   * @param record
   */
  const handleBan = async (record: API.UserInterfaceInfo) => {
    const hide = message.loading('正在封禁');
    try {
      await banUsingPost({
        id: record.id
      });
      hide();
      message.success('封禁成功');
      actionRef.current?.reload()
      return true;
    } catch (error) {
      hide();
      message.error('封禁失败');
      return false;
    }
  };

  /**
   *  not ban
   * @zh-CN 解禁
   *
   * @param record
   */
  const handleNotBan = async (record: API.UserInterfaceInfo) => {
    const hide = message.loading('正在解禁');
    try {
      await notBanUsingPost({
        id: record.id
      });
      hide();
      message.success('解禁成功');
      actionRef.current?.reload()
      return true;
    } catch (error) {
      hide();
      message.error('解禁失败');
      return false;
    }
  };

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '用户编号',
      dataIndex: 'userId',
      valueType: 'text',
      formItemProps: {
        rules: [
          {required: true}
        ]
      },
      ellipsis: true,
    },
    {
      title: '接口编号',
      dataIndex: 'interfaceInfoId',
      valueType: 'text',
      formItemProps: {
        rules: [
          {required: true}
        ]
      },
      ellipsis: true,
    },
    {
      title: '总调用次数',
      dataIndex: 'totalNum',
      valueType: 'text',
      formItemProps: {
        rules: [
          {required: true}
        ]
      },
      ellipsis: true,
    },
    {
      title: '剩余调用次数',
      dataIndex: 'leftNum',
      valueType: 'text',
      formItemProps: {
        rules: [
          {required: true}
        ]
      },
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '正常',
          status: 'Success',
        },
        1: {
          text: '封禁',
          status: 'Default',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          type="text"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        record.status === 0 ?
        <a
          key="ban"
          type="text"
          onClick={() => {
            handleBan(record)
          }}
        >
          封禁
        </a> : null,
        record.status === 1 ?
        <a
          key="notBan"
          type="text"
          onClick={() => {
            handleNotBan(record)
          }}
        >
          解禁
        </a> : null,
        <a
          key="remove"
          type="text"
          onClick={() => {
            handleRemove(record)
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.UserInterfaceInfo, API.PageParams>
        headerTitle={'额度管理'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={async (params) => {
          const res = await listUserInterfaceInfoByPageUsingPost(params);
          if (res.data?.records) {
            return {
              data: res.data.records,
              success: true,
              total: res.data.total,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
      />
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalOpen(false)
        }}
        onSubmit={(values) => {
          handleAdd(values)
        }}
        visible={createModalOpen}
      />
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
