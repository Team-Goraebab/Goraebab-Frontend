'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { colorsOption } from '@/data/color';
import { Network, ThemeColor } from '@/types/type';
import axios from 'axios';

interface HostModalProps {
  onClose: () => void;
  onSave: (
    id: string,
    hostNm: string,
    hostIp: string | undefined,
    isRemote: boolean,
    themeColor: ThemeColor,
    networkName: string,
    networkIp: string
  ) => void;
  availableNetworks: Network[];
}

const HostModal = ({ onClose, onSave, availableNetworks }: HostModalProps) => {
  const id = uuidv4();
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [hostNm, setHostNm] = useState<string>('');
  const [hostIp, setHostIp] = useState<string | undefined>(undefined);
  const [networkName, setNetworkName] = useState<string>('');
  const [networkIp, setNetworkIp] = useState<string>('');
  const [isHostIpConnected, setIsHostIpConnected] = useState<boolean>(false);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(
    null
  );

  const defaultColor = colorsOption.find((color) => !color.sub);
  const defaultSubColor = colorsOption.find(
    (color) => color.label === defaultColor?.label && color.sub
  );

  const [selectedColor, setSelectedColor] = useState<ThemeColor>({
    label: defaultColor?.label || '',
    bgColor: defaultSubColor?.color || '',
    borderColor: defaultColor?.color || '',
    textColor: defaultColor?.color || '',
  });

  useEffect(() => {
    if (availableNetworks.length > 0) {
      const firstNetwork = availableNetworks[0];
      setNetworkName(firstNetwork.Name);
      setNetworkIp(firstNetwork.IPAM?.Config?.[0]?.Gateway || '');
    }
  }, [availableNetworks]);

  const isSaveDisabled = useMemo(() => {
    if (isRemote) {
      return (
        !hostNm || !networkName || !networkIp || !hostIp || !isHostIpConnected
      );
    }
    return !hostNm || !networkName || !networkIp;
  }, [hostNm, networkName, networkIp, isRemote, hostIp, isHostIpConnected]);

  const handleSave = () => {
    if (isSaveDisabled) {
      return;
    }

    onSave(
      id,
      hostNm,
      isRemote ? hostIp : undefined,
      isRemote,
      selectedColor,
      networkName,
      networkIp
    );
    onClose();
  };

  const handleNetworkChange = (selectedNetworkName: string) => {
    const selectedNetwork = availableNetworks.find(
      (net) => net.Name === selectedNetworkName
    );
    setNetworkName(selectedNetworkName);
    setNetworkIp(selectedNetwork?.IPAM?.Config?.[0]?.Gateway || '');
  };

  const handleColorSelection = (colorLabel: string) => {
    const mainColor = colorsOption.find(
      (color) => color.label === colorLabel && !color.sub,
    );
    const subColor = colorsOption.find(
      (color) => color.label === colorLabel && color.sub
    );

    setSelectedColor({
      label: colorLabel,
      bgColor: subColor?.color || '',
      borderColor: mainColor?.color || '',
      textColor: mainColor?.color || '',
    });
  };

  async function fetchConnectRemoteDaemon(hostIp: string) {
    try {
      const response = await axios.get(`/api/daemon/ping?hostIp=${hostIp}`);
      console.log('ping api >>', response);

      if (response.status === 200) {
        setIsHostIpConnected(true);
        setConnectionMessage('연결 성공');
      } else {
        console.error('데몬 연결에 실패했습니다.');
        setIsHostIpConnected(false);
        setConnectionMessage('원격 데몬 연결에 실패했습니다.');
      }
    } catch (error) {
      console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
      setIsHostIpConnected(false);
      setConnectionMessage('원격 데몬 연결에 실패했습니다.');
    }
  }

  const handleConnectClick = () => {
    if (hostIp) {
      fetchConnectRemoteDaemon(hostIp);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Create New Host
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={2}>
          <TextField
            label="Host Name"
            fullWidth
            value={hostNm}
            onChange={(e) => setHostNm(e.target.value)}
            variant="outlined"
            required
          />
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Host Type</Typography>
            <RadioGroup
              row
              value={isRemote ? 'remote' : 'local'}
              onChange={(e) => {
                setIsRemote(e.target.value === 'remote');
                if (e.target.value !== 'remote') {
                  setHostIp(undefined);
                  setIsHostIpConnected(false);
                  setConnectionMessage(null);
                }
              }}
            >
              <FormControlLabel
                value="local"
                control={<Radio />}
                label="Local"
              />
              <FormControlLabel
                value="remote"
                control={<Radio />}
                label="Remote"
              />
            </RadioGroup>
          </FormControl>
          {isRemote && (
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                label="Host IP"
                fullWidth
                value={hostIp || ''}
                onChange={(e) => {
                  setHostIp(e.target.value);
                  setIsHostIpConnected(false);
                  setConnectionMessage(null);
                }}
                variant="outlined"
                required
                error={
                  connectionMessage !== null &&
                  connectionMessage !== '연결 성공'
                }
                helperText={connectionMessage}
              />
              <Button
                onClick={handleConnectClick}
                color="primary"
                variant="contained"
                disabled={!hostIp}
              >
                연결
              </Button>
            </Box>
          )}
          <FormControl fullWidth>
            <InputLabel>Select Network</InputLabel>
            <Select
              value={networkName}
              onChange={(e) => handleNetworkChange(e.target.value)}
              label="Select Network"
              fullWidth
            >
              {availableNetworks && availableNetworks.length > 0 ? (
                availableNetworks.map((net) => (
                  <MenuItem key={net.Id} value={net.Name}>
                    {net.Name} (IP: {net.IPAM?.Config?.[0]?.Gateway || 'None'})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>네트워크가 없습니다.</MenuItem>
              )}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="subtitle1" mb={1}>
              Select Color Theme
            </Typography>
            <Box display="flex" justifyContent="center" gap={2}>
              {colorsOption
                .filter((color) => !color.sub)
                .map((color) => (
                  <Box
                    key={color.id}
                    onClick={() => handleColorSelection(color.label)}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: color.color,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      outline:
                        selectedColor.label === color.label
                          ? '3px solid #D2D2D2'
                          : 'none',
                      outlineOffset: '3px',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.1)' },
                    }}
                  />
                ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'end', p: 3 }}>
        <Button onClick={onClose}>취소</Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={isSaveDisabled}
        >
          생성
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostModal;
