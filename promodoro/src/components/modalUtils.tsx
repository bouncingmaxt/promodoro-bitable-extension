import React from 'react';
import { Modal } from '@douyinfe/semi-ui';
import { createRoot } from 'react-dom/client';

// 定义主题类型
type ThemeType = 'red' | 'blue' | 'green' | 'default';

// 主题配置
const THEME_CONFIG = {
  red: {
    color: '#ff4d4f',
    backgroundColor: '#f5f5f5',
    borderColor: '#ff4d4f'
  },
  blue: {
    color: '#1890ff',
    backgroundColor: '#f5f5f5',
    borderColor: '#1890ff'
  },
  green: {
    color: '#52c41a',
    backgroundColor: '#f5f5f5',
    borderColor: '#52c41a'
  },
  default: {}
};

interface ConfirmOptions {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  theme?: ThemeType;
  confirmTheme?: ThemeType;
  cancelTheme?: ThemeType;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * 显示确认模态框的工具函数
 * @param options 配置选项
 * @returns Promise<boolean> 用户是否确认
 */
export const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
  const {
    title = '确认',
    content = '确定要执行此操作吗？',
    confirmText = '确定',
    cancelText = '取消',
    confirmButtonColor,
    cancelButtonColor,
    theme = 'default',
    confirmTheme,
    cancelTheme,
    onConfirm,
    onCancel
  } = options;

  // 确定确认按钮的主题（优先级：confirmTheme > theme > default）
  const finalConfirmTheme = confirmTheme || theme;
  const confirmThemeConfig = THEME_CONFIG[finalConfirmTheme];

  // 确定取消按钮的主题（优先级：cancelTheme > theme > default）
  const finalCancelTheme = cancelTheme || theme;
  const cancelThemeConfig = THEME_CONFIG[finalCancelTheme];

  // 确定最终的按钮样式（主题优先，然后是自定义颜色，最后是默认）
  const finalConfirmButtonStyle = finalConfirmTheme !== 'default'
    ? confirmThemeConfig
    : confirmButtonColor
      ? { color: confirmButtonColor }
      : undefined;

  const finalCancelButtonStyle = finalCancelTheme !== 'default'
    ? cancelThemeConfig
    : cancelButtonColor
      ? { color: cancelButtonColor }
      : undefined;

  return new Promise((resolve) => {
    // 创建容器元素
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const handleConfirm = () => {
      onConfirm?.();
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      onCancel?.();
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const ModalComponent = () => {
      const [visible, setVisible] = React.useState(true);

      const onOk = () => {
        setVisible(false);
        setTimeout(handleConfirm, 100); // 等待动画完成
      };

      const onCancel = () => {
        setVisible(false);
        setTimeout(handleCancel, 100); // 等待动画完成
      };

      return (
        <Modal
          title={title}
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          okText={confirmText}
          okButtonProps={finalConfirmButtonStyle ? { style: finalConfirmButtonStyle } : undefined}
          cancelText={cancelText}
          cancelButtonProps={finalCancelButtonStyle ? { style: finalCancelButtonStyle } : undefined}
          centered
        >
          {content}
        </Modal>
      );
    };

    root.render(<ModalComponent />);
  });
};

/**
 * 显示信息模态框的工具函数
 * @param options 配置选项
 */
export const showInfo = (options: Omit<ConfirmOptions, 'onCancel' | 'cancelText'>): Promise<void> => {
  const {
    title = '信息',
    content = '',
    confirmText = '确定',
    onConfirm
  } = options;

  return new Promise((resolve) => {
    // 创建容器元素
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const handleConfirm = () => {
      onConfirm?.();
      cleanup();
      resolve();
    };

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const ModalComponent = () => {
      const [visible, setVisible] = React.useState(true);

      const onOk = () => {
        setVisible(false);
        setTimeout(handleConfirm, 100); // 等待动画完成
      };

      return (
        <Modal
          title={title}
          visible={visible}
          onOk={onOk}
          okText={confirmText}
          centered
          footer={[
            <button key="ok" onClick={onOk} className="semi-button semi-button-primary">
              {confirmText}
            </button>
          ]}
        >
          {content}
        </Modal>
      );
    };

    root.render(<ModalComponent />);
  });
};

/**
 * 显示成功模态框的工具函数
 */
export const showSuccess = (options: Omit<ConfirmOptions, 'onCancel' | 'cancelText'>) => {
  return showInfo({
    title: '成功',
    ...options
  });
};

/**
 * 显示错误模态框的工具函数
 */
export const showError = (options: Omit<ConfirmOptions, 'onCancel' | 'cancelText'>) => {
  return showInfo({
    title: '错误',
    ...options
  });
};

/**
 * 显示警告模态框的工具函数
 */
export const showWarning = (options: Omit<ConfirmOptions, 'onCancel' | 'cancelText'>) => {
  return showInfo({
    title: '警告',
    ...options
  });
};