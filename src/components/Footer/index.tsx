import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={"2024 | Powered by wsy"}
      links={[
        {
          key: 'Simple Api',
          title: 'Simple Api',
          href: '#',
          blankTarget: false,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/WsyWang',
          blankTarget: true,
        },
        {
          key: 'Wsy',
          title: 'Wsy',
          href: 'https://github.com/WsyWang',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
