import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ViewSettings } from '../types/view';
import { saveToLocalStorage, loadFromLocalStorage } from '../services/storage';
import { DEFAULT_TIME_SCALE, DEFAULT_ZOOM } from '../constants/config';

interface ViewContextType {
  viewSettings: ViewSettings;
  updateViewSettings: (settings: Partial<ViewSettings>) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (taskId: string | null) => void;
  isEditModalOpen: boolean;
  openEditModal: (taskId?: string) => void;
  closeEditModal: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
}

export const ViewProvider: React.FC<ViewProviderProps> = ({ children }) => {
  const getInitialViewSettings = (): ViewSettings => {
    const loadedData = loadFromLocalStorage();
    if (loadedData && loadedData.viewSettings) {
      return loadedData.viewSettings;
    }

    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);
    const endDateStr = endDate.toISOString().split('T')[0];

    return {
      timeScale: DEFAULT_TIME_SCALE,
      startDate: today,
      endDate: endDateStr,
      zoom: DEFAULT_ZOOM,
    };
  };

  const [viewSettings, setViewSettings] = useState<ViewSettings>(getInitialViewSettings);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadedData = loadFromLocalStorage();
    if (loadedData) {
      saveToLocalStorage({
        ...loadedData,
        viewSettings,
        lastModified: new Date().toISOString(),
      });
    }
  }, [viewSettings]);

  const updateViewSettings = (settings: Partial<ViewSettings>) => {
    setViewSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  const openEditModal = (taskId?: string) => {
    if (taskId) {
      setSelectedTaskId(taskId);
    }
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTaskId(null);
  };

  const value: ViewContextType = {
    viewSettings,
    updateViewSettings,
    selectedTaskId,
    setSelectedTaskId,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};
