// 倒计时设置组件

import React, { useEffect, useState } from 'react';
import { Card, InputNumber, Button, Typography, Space, Toast } from '@douyinfe/semi-ui';
import { useStorageContext } from '../contexts';

interface TimerSettingsProps {}

const { Title, Text } = Typography;

export const TimerSettings: React.FC<TimerSettingsProps> = ({}) => {
  const { userSettings, updateUserSettings } = useStorageContext();

  const [duration, setDuration] = useState(userSettings.timerDuration);
  const [saving, setSaving] = useState(false);
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    setCanSave(duration !== userSettings.timerDuration);
  }, [duration]);

  const handleSave = async () => {
    if (duration <= 0) {
      Toast.error('倒计时时长必须大于0分钟');
      return;
    }

    setSaving(true);
    try {
      updateUserSettings({ timerDuration: duration });
      setCanSave(false);
      Toast.success('设置已保存');
    } catch (error) {
      Toast.error('保存设置失败');
      console.error('保存设置失败:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: 16 }}>
      <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text>单次专注时长:</Text>
          <InputNumber
            value={duration}
            onChange={(value) => setDuration(value as number)}
            min={1}
            max={120}
            suffix="分钟"
            style={{ width: 120 }}
          />
        </div>

        <Button
          type="primary"
          onClick={handleSave}
          loading={saving}
          disabled={!canSave}
        >
          保存
        </Button>
      </Space>

      {canSave && (
        <Text type="warning" size="small" style={{ display: 'block', marginTop: 8 }}>
          设置已修改，请点击保存
        </Text>
      )}
    </Card>
  );
};