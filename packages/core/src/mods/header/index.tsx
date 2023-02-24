/*
 * @Author: MrAlenZhong
 * @Date: 2023-02-23 14:15:02
 * @LastEditors: MrAlenZhong
 * @LastEditTime: 2023-02-24 16:21:36
 * @Description: 
 */
import React, { useState, useCallback } from 'react';

import styles from './index.module.less';

import { Graph } from '@antv/x6';
import { Modal, message } from 'antd';
import Guide from './guide';
import Export from './export';
import ImportDSL from './importDSL';
import ConnectStatus, { Status } from './connectStatus';
import Configuration from './configuration';
import { localConnect } from '../../api';

interface IProps {
  flowChart: Graph;
}

const Header: React.FC<IProps> = (props: IProps) => {
  const { flowChart } = props;
  const [projectName, setProjectName] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.disconnected);

  // network
  const syncLocal = useCallback(() => {
    return localConnect()
      .then((res) => res.json())
      .then((data = {}) => {
        setStatus(Status.connected);
        setProjectName(data.projectName);
        return data;
      })
      .catch((error) => {
        console.log(error);
        setStatus(Status.disconnected);
        console.log('connect local failed, the error is:', error.message);
      });
  }, [setStatus, setProjectName]);

  const confirmToSync = useCallback(() => {
    return syncLocal().then((data) => {
      const { dsl } = data || {};
      if (dsl) {
        Modal.confirm({
          title: '本地连接成功，是否将数据同步至当前项目？',
          onOk() {
            try {
              flowChart.fromJSON(dsl);
            } catch (error) {
              message.error('同步失败！');
            }
          },
        });
      }
    });
  }, [syncLocal, flowChart]);

  return (
    <div className={styles.container}>
      <a>
        <span className={styles.titleText}>DG-FLOW</span>
      </a>
      <div className={styles.widgets}>
        <Guide />
        <Export flowChart={flowChart} />
        <ImportDSL flowChart={flowChart} />
        <ConnectStatus
          status={status}
          projectName={projectName}
          syncLocal={syncLocal}
          confirmToSync={confirmToSync}
        />
        <Configuration confirmToSync={confirmToSync} />
      </div>
    </div>
  );
};

export default Header;
