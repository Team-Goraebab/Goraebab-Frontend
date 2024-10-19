'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  Divider,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchData } from '@/services/apiUtils';

interface SelectVolumeModalProps {
  open: boolean;
  imageName: string;
  onClose: () => void;
  onSave: (selectedVolumes: any[]) => void;
  initialSelectedVolumes: any[];
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxHeight: 300,
  overflow: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiListItem-root': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
}));

const SelectVolumeModal = ({
                             open,
                             imageName,
                             onClose,
                             onSave,
                             initialSelectedVolumes,
                           }: SelectVolumeModalProps) => {
  const [volumes, setVolumes] = useState<any[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  useEffect(() => {
    loadData();
    setSelectedVolumes(initialSelectedVolumes.map((v) => v.Name));
  }, [open]);

  const loadData = async () => {
    try {
      const volumeData = await fetchData('/api/volume/list');
      setVolumes(volumeData?.Volumes || []);
    } catch (error) {
      console.error('Failed to load volumes:', error);
    }
  };

  const handleVolumeChange = (volumeName: string) => {
    setSelectedVolumes((prev) =>
      prev.includes(volumeName)
        ? prev.filter((v) => v !== volumeName)
        : [...prev, volumeName],
    );
  };

  const handleSave = () => {
    const selectedVolumeData = volumes.filter((v) =>
      selectedVolumes.includes(v.Name),
    );
    onSave(selectedVolumeData);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{`${imageName} 볼륨 선택`}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            사용할 볼륨을 선택하세요
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            아래 목록에서 하나 이상의 볼륨을 선택할 수 있습니다.
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {volumes.length > 0 ? (
          <StyledPaper elevation={0}>
            <List disablePadding>
              {volumes.map((volume) => (
                <ListItem
                  key={volume.Id}
                  dense
                  component="div"
                  onClick={() => handleVolumeChange(volume.Name)}
                  sx={{ cursor: 'pointer', overflow: 'hidden', paddingX: 4, paddingY: 1 }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedVolumes.includes(volume.Name)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1" className="truncate">{volume.Name}</Typography>}
                    secondary={
                      <Typography variant="body2" color="text.secondary" className="font-pretendard">
                        Driver: {volume.Driver}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            사용 가능한 볼륨이 없습니다.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          취소
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={selectedVolumes.length === 0}
        >
          저장
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default SelectVolumeModal;
