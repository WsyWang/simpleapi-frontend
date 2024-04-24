import {Footer} from '@/components';
import {userLoginUsingPost, userRegisterUsingPost} from '@/services/simpleapi-backend/userController';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {
  LoginForm,
  ModalForm,
  ProFormCheckbox,
  ProFormText,
  Settings as LayoutSettings
} from '@ant-design/pro-components';
import {Helmet, history, useModel} from '@umijs/max';
import {Alert, Form, message} from 'antd';
import {createStyles} from 'antd-style';
import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({token}) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const {setInitialState} = useModel('@@initialState');
  const {styles} = useStyles();
  const fetchUserInfo = (userInfo: API.UserVO) => {
    if (userInfo) {
      flushSync(() => {
        setInitialState({
          loginUser: userInfo,
          settings: Settings as Partial<LayoutSettings>,
        });
      });
    }
  };
  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLoginUsingPost({
        ...values,
      });
      if (res.data) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        fetchUserInfo(res.data);
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        message.error('登录失败,' + res.message);
        setUserLoginState({status: 'error'});
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const {status} = userLoginState;
  const [form] = Form.useForm<API.UserRegisterRequest>();
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.png"/>}
          title="Simple Api"
          subTitle={'致力于提供高质量Api的开放平台'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          {status === 'error' && (
            <LoginMessage content={'登录失败，请重试'}/>
          )}

          <>
            <ProFormText
              name="userAccount"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined/>,
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="userPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined/>,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </>

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
              onClick={() => setVisible(true)}
            >
              立即注册
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer/>

      <ModalForm<API.UserRegisterRequest>
        open={visible}
        title="注册"
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setVisible(false),
          style: {display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center"}
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          try {
            await userRegisterUsingPost(values)
            message.success('注册成功')
          } catch (error: any) {
            message.error('注册失败,' + error.message)
          }
          setVisible(false);
          return true;
        }}
      >
        <ProFormText
          width="md"
          name="userAccount"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined/>,
          }}
          rules={[
            {
              required: true,
              message: '账号是必填项！',
            },
          ]}
          placeholder={"账号"}
        />
        <ProFormText.Password
          width="md"
          name="userPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined/>,
          }}
          rules={[
            {
              required: true,
              message: '密码是必填项！',
            },
          ]}
          placeholder={"密码"}
        />
        <ProFormText.Password
          width="md"
          name="checkPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined/>,
          }}
          rules={[
            {
              required: true,
              message: '密码是必填项！',
            },
          ]}
          placeholder="请再次输入密码"
        />
      </ModalForm>
    </div>
  );
};
export default Login;
