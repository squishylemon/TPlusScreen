import { useState, useRef, useEffect } from 'react';
import './App.css';

import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { motion, AnimatePresence } from 'framer-motion';


const settingsConfig = {
  General: [
    { id: 'darkMode', label: 'Dark Mode', type: 'boolean', default: false },
    { id: 'notifications', label: 'Enable Notifications', type: 'boolean', default: true },
  ],
  Account: [
    { id: 'emailAlerts', label: 'Email Alerts', type: 'boolean', default: true },
    { id: 'twoFactorAuth', label: 'Two-Factor Authentication', type: 'boolean', default: false },
  ],
  Privacy: [
    { id: 'locationSharing', label: 'Location Sharing', type: 'boolean', default: false },
    { id: 'adPersonalization', label: 'Ad Personalization', type: 'boolean', default: true },
  ],
};

const infoConfig = {
  "Adding Apps": "To add an app, click the '+' button on the main screen, fill in the app details, and hit 'Save'. The app will appear on your dashboard.",
  "Removing Apps": "To remove an app, long-press the app icon and select 'Remove'. Confirm the action in the dialog.",
  "Customization": "You can customize the layout and colors by accessing the 'Appearance' tab in settings.",
};

const baseApps = [
  { title: '9Anime', uri: 'https://9anime.to', image: 'https://cdn2.steamgriddb.com/icon/6ef77bd3e3cfb00cd02bba48e6e9a9e3.png' },
  { title: 'Apple TV', uri: 'https://tv.apple.com', image: 'https://icons.veryicon.com/png/Media/Apple%20TV/Apple%20TV%20Logo.png' },
  { title: 'CoupangPlay', uri: 'https://www.coupangplay.com', image: 'https://play-lh.googleusercontent.com/b0eSS0LrM52IqHtp1xOkaW--Js1xDLmE3cejCOY3iQNTMIMSUZ6wGhW0izQfpM9m3bNu' },
  { title: 'Crave', uri: 'https://www.crave.ca', image: 'https://img.icons8.com/color/512/crave.png' },
  { title: 'Crunchyroll', uri: 'https://www.crunchyroll.com', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png' },
  { title: 'Curiosity Stream', uri: 'https://curiositystream.com', image: 'https://curiositystream.com/favicon.ico' },
  { title: 'Disney+', uri: 'https://www.disneyplus.com', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnWCBm4y0FVTn6msaaLRzmSAdFxC_eWdKsNR87cnXpbP4dPM-NIwkcIrLIe1nbxoCSKeY&usqp=CAU' },
  { title: 'FuboTV', uri: 'https://www.fubo.tv', image: 'https://images.seeklogo.com/logo-png/42/1/fubotv-logo-png_seeklogo-427431.png' },
  { title: 'GeForce Now', uri: 'https://www.nvidia.com/en-us/geforce-now', image: 'https://images.seeklogo.com/logo-png/45/2/nvidia-geforce-now-logo-png_seeklogo-457169.png' },
  { title: 'Google', uri: 'https://www.google.com', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWIl8zC8WAMHi5JVmKUb3YVvZd5gvoCdy-NQ&s' },
  { title: 'HackerNews', uri: 'https://news.ycombinator.com', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOA59xI7lS4aEcMYWj6WGB4ITk2waj9Jwfcg&s' },
  { title: 'Hulu', uri: 'https://www.hulu.com', image: 'https://static.vecteezy.com/system/resources/previews/056/658/334/non_2x/hulu-logo-free-download-hulu-logo-free-png.png' },
  { title: 'Max', uri: 'https://www.max.com', image: 'https://brandlogo.org/wp-content/uploads/2024/06/Max-Logo.png.webp' },
  { title: 'Nebula', uri: 'https://nebula.tv', image: 'https://nebula.app/favicon.ico' },
  { title: 'Netflix', uri: 'https://www.netflix.com', image: 'https://www.citypng.com/public/uploads/preview/netflix-vector-flat-logo-735811696261671nhzlvgcmyf.png' },
  { title: 'Paramount+', uri: 'https://www.paramountplus.com', image: 'https://images.seeklogo.com/logo-png/39/2/paramount-logo-png_seeklogo-397501.png' },
  { title: 'Peacock', uri: 'https://www.peacocktv.com', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT27tw9PRgjgX3cWC5YKnNhoYn6WRX33zFHMQ&s' },
  { title: 'Plex', uri: 'https://www.plex.tv', image: 'https://e1.pngegg.com/pngimages/253/744/png-clipart-clay-os-6-a-macos-icon-plex-yellow-arrow-thumbnail.png' },
  { title: 'Prime Video', uri: 'https://www.primevideo.com', image: 'https://www.citypng.com/public/uploads/preview/white-square-amazon-prime-app-icon-701751695133980xffneuh8qp.png' },
  { title: 'Reddit', uri: 'https://www.reddit.com', image: 'https://i.imgur.com/ws2kAA0.png' },
  { title: 'Sling', uri: 'https://www.sling.com', image: 'https://images.seeklogo.com/logo-png/45/2/sling-tv-logo-png_seeklogo-458871.png' },
  { title: 'TikTok', uri: 'https://www.tiktok.com', image: 'https://static.vecteezy.com/system/resources/previews/042/127/129/non_2x/square-tiktok-logo-with-thick-white-border-and-shadow-on-a-transparent-background-free-png.png' },
  { title: 'Twitch', uri: 'https://www.twitch.tv', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvFdTju4u9zCmUa1CFdtyvcZSoQQBDEnH-A&s' },
  { title: 'Xbox Cloud', uri: 'https://www.xbox.com/en-US/play', image: 'https://images.seeklogo.com/logo-png/45/2/xbox-cloud-gaming-logo-png_seeklogo-457171.png' },
  { title: 'YouTube', uri: 'https://www.youtube.com', image: 'https://static.vecteezy.com/system/resources/previews/018/930/688/non_2x/youtube-logo-youtube-icon-transparent-free-png.png' },
  { title: 'YouTube TV', uri: 'https://tv.youtube.com', image: 'https://images.seeklogo.com/logo-png/61/2/youtube-tv-logo-png_seeklogo-612184.png' },
];



function App() {
  const [hidden, setHidden] = useState(false);
  const dragging = useRef(false);
  const startY = useRef(0);
  const diffY = useRef(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [infoOpen, setInfoOpen] = useState(false);
  const openInfo = () => setInfoOpen(true);
  const closeInfo = () => setInfoOpen(false);
  const [selectedInfoCategory, setSelectedInfoCategory] = useState(Object.keys(infoConfig)[0]);
  const [appSelectorOpen, setAppSelectorOpen] = useState(false);
  const [customApps, setCustomApps] = useState([]);
  const [enabledApps, setEnabledApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({ title: '', uri: '', image: '' });
  const [fullscreenApp, setFullscreenApp] = useState(null);
const [hasLoaded, setHasLoaded] = useState(false);

useEffect(() => {
  const storedEnabled = JSON.parse(localStorage.getItem('enabledApps')) || [];
  setEnabledApps(storedEnabled);
  setHasLoaded(true); // ✅ done loading
}, []);

  // State to hold actual settings values
  const [settingsValues, setSettingsValues] = useState(() => {
    const initial = {};
    for (const category in settingsConfig) {
      settingsConfig[category].forEach(setting => {
        initial[setting.id] = setting.default;
      });
    }
    return initial;
  });

  const toggleSetting = (id) => {
    setSettingsValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const onMouseDown = (e) => {
    dragging.current = true;
    startY.current = e.clientY;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    diffY.current = e.clientY - startY.current;

    if (diffY.current > 50) {
      setHidden(true);
      dragging.current = false;
      cleanup();
    }
  };

  const onMouseUp = () => {
    cleanup();
  };

  const cleanup = () => {
    dragging.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const showBar = () => {
    setHidden(false);
  };

  const filteredApps = [...baseApps, ...customApps].filter(app =>
    app.title.toLowerCase().includes(search.toLowerCase())
  );

  const openAppSelector = () => setAppSelectorOpen(true);
  const closeAppSelector = () => setAppSelectorOpen(false);

 const toggleAppEnabled = (title) => {
  setEnabledApps(prev =>
    prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
  );
  setSelectedApp(null); // auto-close toggle dialog
};



  const getAppByTitle = (title) => {
    return [...baseApps, ...customApps].find(app => app.title === title);
  };

  const activeApps = enabledApps.map(title => getAppByTitle(title)).filter(Boolean);
  const middleIndex = Math.floor(activeApps.length / 2);
  const leftApps = activeApps.slice(0, middleIndex);
  const rightApps = activeApps.slice(middleIndex);



  useEffect(() => {
    const storedCustom = JSON.parse(localStorage.getItem('customApps')) || [];
    const storedEnabled = JSON.parse(localStorage.getItem('enabledApps')) || [];
    const storedSettings = JSON.parse(localStorage.getItem('settingsValues')) || {};

    setCustomApps(storedCustom);
    setEnabledApps(storedEnabled);

    // Merge stored settings with default settings
    const mergedSettings = {};
    for (const category in settingsConfig) {
      settingsConfig[category].forEach(setting => {
        const id = setting.id;
        mergedSettings[id] = storedSettings.hasOwnProperty(id) ? storedSettings[id] : setting.default;
      });
    }
    setSettingsValues(mergedSettings);
  }, []);




  useEffect(() => {
    localStorage.setItem('customApps', JSON.stringify(customApps));
  }, [customApps]);

  useEffect(() => {
    localStorage.setItem('enabledApps', JSON.stringify(enabledApps));
  }, [enabledApps]);

  useEffect(() => {
    localStorage.setItem('settingsValues', JSON.stringify(settingsValues));
  }, [settingsValues]);



  useEffect(() => {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const waves = Array.from({ length: 8 }, (_, i) => ({
      amplitude: 30 + i * 5,
      wavelength: 100 + i * 15,
      phase: Math.random() * Math.PI * 2,
      speed: (0.002 + Math.random() * 0.003),
      baseY: height / 2 + i * 20 - 80,
      gray: 50 + i * 20,
    }));

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.5;

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.strokeStyle = `rgb(${wave.gray},${wave.gray},${wave.gray})`;

        for (let x = 0; x <= width; x++) {
          const y = wave.baseY + Math.sin((x / wave.wavelength) + wave.phase + time * wave.speed) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.stroke();
      });

      requestAnimationFrame(render);
    };

    render(0);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      waves.forEach((wave, i) => {
        wave.baseY = height / 2 + i * 20 - 80;
      });
    };

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);


  return (
    <>
      <canvas id="bgCanvas" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100vw',
        height: '100vh',
      }}></canvas>


      {/* Drag Handle */}
      <AnimatePresence>
        {hidden && (
          <Box
            onClick={showBar}
            onMouseDown={onMouseDown}
            key="drag-handle"
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            sx={{
              position: 'fixed',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 50,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#ccc',
              cursor: 'pointer',
              zIndex: 1001,
            }}
          />
        )}
      </AnimatePresence>

      {/* Animated Bottom App Bar */}
      <AnimatePresence>
        {!hidden && (
          <motion.div
            key="app-bar"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onMouseDown={onMouseDown}
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 250,
            }}
            style={{
              position: 'fixed',
              bottom: 20,
              left: 20,
              right: 20,
              zIndex: 1000,
              cursor: 'grab',
            }}
          >
            <Paper
              elevation={6}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 4,
                backgroundColor: '#f8f8f8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'hidden', // Mask effect
              }}
            >
              {/* Settings Icon */}
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.05 }}
              >
                <Tooltip title="Settings" arrow>
                  <IconButton
                    onClick={openSettings}
                    sx={{
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                      width: 48,
                      height: 48,
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </motion.div>

              <Box
                sx={{
                  width: '100%',           // full width of the bar container
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  userSelect: 'none',
                }}
              >
                {/* Left apps reversed so closest to center */}
                {leftApps.slice().reverse().map((app, i) => (
                  <Tooltip key={`left-${i}`} title={app.title} arrow>
                    <IconButton
                      onClick={() => setFullscreenApp(app)}
                      sx={{
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        width: 48,
                        height: 48,
                        p: 0.5,
                        '&:hover': { backgroundColor: '#e0e0e0' },
                      }}
                    >
                      <img
                        src={app.image || 'https://cdn-icons-png.flaticon.com/512/9603/9603852.png'}
                        alt={app.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </IconButton>
                  </Tooltip>
                ))
                }

                {/* Center + button */}
                <Tooltip title="Add Apps" arrow>
                  <IconButton
                    onClick={openAppSelector}
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: 2,
                      width: 48,
                      height: 48,
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>

                {/* Right apps */}
                {rightApps.map((app, i) => (
                  <Tooltip key={`right-${i}`} title={app.title} arrow>
                    <IconButton
                      onClick={() => setFullscreenApp(app)}
                      sx={{
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        width: 48,
                        height: 48,
                        p: 0.5,
                        '&:hover': { backgroundColor: '#e0e0e0' },
                      }}
                    >
                      <img
                        src={app.image || 'https://cdn-icons-png.flaticon.com/512/9603/9603852.png'}
                        alt={app.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </IconButton>
                  </Tooltip>
                ))
                }
              </Box>




              <Box sx={{ flexGrow: 1 }} />

              {/* Info Icon */}
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
              >
                <Tooltip title="About" arrow>
                  <IconButton
                    onClick={openInfo}
                    sx={{
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                      width: 48,
                      height: 48,
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </motion.div>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeSettings}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'black',
                zIndex: 1500,
              }}
            />

            {/* Sliding Modal */}
            <motion.div
              key="settings-modal"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: 0,
                color: '#000',
                left: 0,
                height: '100vh',
                width: '33.33vw',
                backgroundColor: '#fff',
                zIndex: 1600,
                boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header with Close button */}
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Settings</Typography>
                <IconButton onClick={closeSettings}><CloseIcon /></IconButton>
              </Box>

              <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Categories List */}
                <Box
                  sx={{
                    width: '30%',
                    borderRight: '1px solid #ddd',
                    overflowY: 'auto',
                  }}
                >
                  {Object.keys(settingsConfig).map((category) => (
                    <Box
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        cursor: 'pointer',
                        bgcolor: selectedCategory === category ? 'primary.main' : 'transparent',
                        color: selectedCategory === category ? 'primary.contrastText' : 'text.primary',
                        fontWeight: selectedCategory === category ? 'bold' : 'normal',
                        '&:hover': {
                          bgcolor: selectedCategory === category ? 'primary.dark' : 'action.hover',
                        },
                      }}
                    >
                      {category}
                    </Box>
                  ))}
                </Box>

                {/* Settings Content */}
                <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
                  {settingsConfig[selectedCategory].map(setting => {
                    if (setting.type === 'boolean') {
                      return (
                        <FormControlLabel
                          key={setting.id}
                          control={
                            <Switch
                              checked={settingsValues[setting.id]}
                              onChange={() => toggleSetting(setting.id)}
                            />
                          }
                          label={setting.label}
                          sx={{ mb: 2 }}
                        />
                      );
                    }
                    // You can add more setting types here
                    return null;
                  })}
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {infoOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="info-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeInfo}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'black',
                zIndex: 1500,
              }}
            />

            {/* Sliding Info Modal */}
            <motion.div
              key="info-modal"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: '33.33vw',
                backgroundColor: '#fff',
                color: '#000',
                zIndex: 1600,
                boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Information</Typography>
                <IconButton onClick={closeInfo}><CloseIcon /></IconButton>
              </Box>

              <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Categories List */}
                <Box
                  sx={{
                    width: '30%',
                    borderRight: '1px solid #ddd',
                    overflowY: 'auto',
                  }}
                >
                  {Object.keys(infoConfig).map((category) => (
                    <Box
                      key={category}
                      onClick={() => setSelectedInfoCategory(category)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        cursor: 'pointer',
                        bgcolor: selectedInfoCategory === category ? 'primary.main' : 'transparent',
                        color: selectedInfoCategory === category ? 'primary.contrastText' : 'text.primary',
                        fontWeight: selectedInfoCategory === category ? 'bold' : 'normal',
                        '&:hover': {
                          bgcolor: selectedInfoCategory === category ? 'primary.dark' : 'action.hover',
                        },
                      }}
                    >
                      {category}
                    </Box>
                  ))}
                </Box>

                {/* Text Content */}
                <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
                  <Typography variant="body1">
                    {infoConfig[selectedInfoCategory]}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* App Selector Fullscreen Modal */}
      <AnimatePresence>
        {appSelectorOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <TextField
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search apps..."
                variant="outlined"
                sx={{ top: 5, p: 1, width: '20%', textAlign: 'center', cursor: 'pointer' }}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', flex: 1 }}>
              {filteredApps.map((app, index) => (
                <Paper
                  key={index}
                  onClick={() => setSelectedApp(app)}
                  sx={{ p: 2, width: 64, height: 64, textAlign: 'bottom', cursor: 'pointer' }}
                >
                  <img
                    src={app.image || 'https://cdn-icons-png.flaticon.com/512/9603/9603852.png'}
                    alt={app.title}
                    style={{ width: 64, height: 64, objectFit: 'cover', border: enabledApps.includes(app.title) ? '2px solidrgb(131, 157, 182)' : 'none', marginBottom: 10 }}
                  />
                  <Typography>{app.title}</Typography>
                </Paper>
              ))}
            </Box>

            <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
              <Button variant="contained" onClick={() => setAddDialogOpen(true)}>Add Your Own</Button>
            </Box>

            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <IconButton onClick={closeAppSelector}><CloseIcon /></IconButton>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enable Toggle Modal */}
      <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)}>
        <DialogTitle>{selectedApp?.title}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={enabledApps.includes(selectedApp?.title)}
                onChange={() => toggleAppEnabled(selectedApp?.title)}
              />
            }
            label="Enabled"
          />
        </DialogContent>
      </Dialog>

      {/* FullScreenApp */}
      <AnimatePresence>
        {fullscreenApp && (
          <>
            <motion.div
              key="fullscreen-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setFullscreenApp(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'black',
                zIndex: 2000,
              }}
            />

            <motion.div
              key="fullscreen-app"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 2100,
                backgroundColor: '#000',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#111' }}>
                <Typography variant="h6" color="#fff">{fullscreenApp.title}</Typography>
                <IconButton onClick={() => setFullscreenApp(null)} sx={{ color: '#fff' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <iframe
                src={fullscreenApp.uri}
                style={{ flexGrow: 1, border: 'none' }}
                title={fullscreenApp.title}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add App Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Custom App</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" margin="dense" value={newApp.title} onChange={e => setNewApp({ ...newApp, title: e.target.value })} />
          <TextField fullWidth label="URI" margin="dense" value={newApp.uri} onChange={e => setNewApp({ ...newApp, uri: e.target.value })} />
          <TextField fullWidth label="Image URL (optional)" margin="dense" value={newApp.image} onChange={e => setNewApp({ ...newApp, image: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (newApp.title && newApp.uri) {
                setCustomApps(prev => [...prev, newApp]);
                setNewApp({ title: '', uri: '', image: '' });
                setAddDialogOpen(false);
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default App;