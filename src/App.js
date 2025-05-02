import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { nanoid } from "nanoid";
import generateStupidName from "sillyname";
import io from "socket.io-client";
import SimplePeer from "simple-peer";
import SimplePeerFiles from "simple-peer-files";
import { isMobile } from "react-device-detect";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laptop,
  Smartphone,
  Send,
  File,
  Upload,
  Download,
  Moon,
  Sun,
  FileUp,
  UploadCloud,
  X,
  CheckCircle,
  Share2,
  Wifi,
  Info,
  AlertCircle,
} from "lucide-react";

// Enhanced Background Gradient Component
const BackgroundGradients = ({ isDark }) => (
  <div className="fixed inset-0 z-[-2] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-500"></div>
    <motion.div
      className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-purple-600/10 dark:bg-purple-600/20 blur-[120px]"
      animate={{
        x: [0, 40, 0],
        y: [0, 30, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        easings: ["easeInOut"],
      }}
    />
    <motion.div
      className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-600/10 dark:bg-indigo-600/20 blur-[100px]"
      animate={{
        x: [0, -40, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        easings: ["easeInOut"],
      }}
    />
    <motion.div
      className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-[90px]"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        easings: ["easeInOut"],
      }}
    />
  </div>
);

// Subtle Grid Overlay
const GridOverlay = ({ isDark }) => (
  <div className="fixed inset-0 z-[-1] opacity-30 dark:opacity-20 pointer-events-none">
    <div
      className="h-full w-full"
      style={{
        backgroundImage: `linear-gradient(to right, ${
          isDark ? "#ffffff08" : "#00000008"
        } 1px, transparent 1px), 
                          linear-gradient(to bottom, ${
                            isDark ? "#ffffff08" : "#00000008"
                          } 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
      }}
    />
  </div>
);

// About Modal Component
const AboutModal = ({ isOpen, onClose, isDark }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/30 dark:bg-gray-900/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative z-10 border border-white/50 dark:border-gray-700/50 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            About FlyFiles
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            FlyFiles is a peer-to-peer file sharing application that allows you
            to transfer files directly between devices without storing them in
            the cloud.
          </p>
          <p>
            Built with modern web technologies, FlyFiles ensures fast and secure
            file transfers using WebRTC and end-to-end encryption.
          </p>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Direct device-to-device transfers</li>
              <li>No file size limits</li>
              <li>End-to-end encryption</li>
              <li>Cross-platform compatibility</li>
              <li>Real-time transfer progress</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Navbar Component
const Navbar = ({ isDark, toggleDarkMode, onAboutClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-white/10 dark:bg-gray-900/20 border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Share2 className="text-indigo-500 dark:text-indigo-400" size={24} />
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 text-transparent bg-clip-text">
            FlyFiles
          </h1>
        </motion.div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAboutClick}
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all flex items-center gap-2"
          >
            <Info size={16} />
            About
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Device Illustrations Component
const DeviceIllustrations = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="relative h-[320px] w-full md:h-[340px] md:w-[450px] mx-auto"
  >
    {/* Desktop/Laptop device */}
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="absolute left-0 md:left-10 top-8 w-[240px] h-[180px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg border-gray-300 border-2 dark:border-gray-700/50 shadow-xl overflow-hidden z-10"
    >
      {/* Laptop base */}
      <div className="absolute bottom-0 left-0 right-0 h-[15px] bg-gray-200/90 dark:bg-gray-700/90 transform perspective-700 rotateX(5deg) scale-[1.03] origin-bottom"></div>

      {/* Screen */}
      <div className="h-[160px] p-3 bg-gradient-to-br bg-white dark:from-gray-800 dark:to-gray-900 rounded-t-lg border-b border-gray-300/50 dark:border-gray-600/50">
        {/* Menu bar */}
        <div className="w-full h-4 bg-gray-200/70 dark:bg-gray-700/70 rounded-sm mb-2 flex items-center px-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <div className="h-2 bg-indigo-200/70 dark:bg-indigo-700/70 rounded-sm w-2/3"></div>
          <div className="h-2 bg-gray-200/70 dark:bg-gray-700/70 rounded-sm w-full"></div>
          <div className="h-2 bg-gray-200/70 dark:bg-gray-700/70 rounded-sm w-5/6"></div>
          <div className="h-8 mt-2 bg-indigo-100/70 dark:bg-indigo-900/70 rounded-md flex items-center justify-center">
            <FileUp
              size={16}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
        </div>
      </div>
    </motion.div>

    {/* Mobile device */}
    <motion.div
      animate={{
        y: [0, 8, 0],
        rotate: [1, -1, 1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
        delay: 0.5,
      }}
      className="absolute right-0 md:right-10 border-2 top-0 w-[100px] h-[200px] bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-[18px] border-gray-300 dark:border-gray-700/50 shadow-xl overflow-hidden z-20"
    >
      {/* Notch */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[40px] h-[12px] bg-gray-800 dark:bg-black rounded-full z-10"></div>

      {/* Screen */}
      <div className="h-full p-2 pt-5 bg-gradient-to-br bg-white dark:from-gray-800 dark:to-gray-900">
        {/* Content */}
        <div className="space-y-2">
          <div className="h-12 mt-3 bg-indigo-100/70 dark:bg-indigo-900/70 rounded-md flex items-center justify-center">
            <Download
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <div className="h-1.5 bg-gray-300/70 dark:bg-gray-600/70 rounded-full w-3/4 mx-auto"></div>
          <div className="h-1.5 bg-gray-300/70 dark:bg-gray-600/70 rounded-full w-2/3 mx-auto"></div>
        </div>
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[40px] h-[4px] bg-gray-400 dark:bg-gray-600 rounded-full"></div>
    </motion.div>
  </motion.div>
);

// Available Devices Component
const AvailableDevices = ({
  deviceName,
  isMobile,
  sendStatus,
  onClickEvent,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between rounded-xl p-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/30 dark:border-gray-700/30 mb-2"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/50">
          {isMobile ? (
            <Smartphone
              className="text-indigo-600 dark:text-indigo-400"
              size={16}
            />
          ) : (
            <Laptop
              className="text-indigo-600 dark:text-indigo-400"
              size={16}
            />
          )}
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
          {deviceName || "Unknown Device"}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={!sendStatus}
        onClick={onClickEvent}
        className={`p-1.5 rounded-full ${
          sendStatus
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
        } transition-all`}
      >
        <Send size={16} />
      </motion.button>
    </motion.div>
  );
};

// File Upload Card Component
const FileCard = ({ onChangeEvent, fileName, isEmpty }) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChangeEvent(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChangeEvent(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div
        className={`relative rounded-xl p-4 transition-all duration-300 border-2 border-dashed ${
          dragging
            ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/20 scale-[1.02]"
            : isEmpty
            ? "border-gray-300 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30"
            : "border-green-500 bg-green-50/30 dark:bg-green-900/20"
        } backdrop-blur-md text-center cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        <div className="flex flex-col items-center justify-center py-3">
          {isEmpty ? (
            <>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 mb-2 rounded-full bg-indigo-100/50 dark:bg-indigo-900/50"
              >
                <UploadCloud
                  size={24}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </motion.div>
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-1">
                Drop your file here
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                or click to browse
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-indigo-700 transition-colors"
              >
                <Upload size={14} />
                Select a file
              </motion.button>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-2 mb-2 rounded-full bg-green-100/50 dark:bg-green-900/50"
              >
                <File
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
              </motion.div>
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-1">
                File ready to send
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 max-w-md truncate">
                {fileName}
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-indigo-700 transition-colors"
                >
                  <Send size={14} />
                  Send File
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeEvent([]);
                  }}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <X size={14} />
                  Clear
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Transfer Progress Component
const TransferProgress = ({
  isVisible,
  progress = 0,
  fileName = "",
  isReceiving = false,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/50 dark:border-gray-700/50 shadow-xl w-72"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {isReceiving ? (
                <Download
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
              ) : (
                <Upload
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              )}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {isReceiving ? "Receiving file..." : "Sending file..."}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-40">
                  {fileName}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={16} />
            </motion.button>
          </div>

          <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 rounded-full"
            />
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-300">
              {progress}% complete
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {progress < 100 ? "Transferring..." : "Complete"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Searching Devices Component
const SearchingDevices = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + ".";
        } else {
          return ".";
        }
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="rounded-xl overflow-hidden">
      <motion.div
        className="py-2 px-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/30 dark:border-gray-700/30 flex items-center gap-3"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100/50 dark:bg-indigo-900/50 flex items-center justify-center">
          <Wifi className="text-indigo-600 dark:text-indigo-400" size={16} />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Searching for devices{dots}
        </p>
      </motion.div>
    </div>
  );
};

// Connection Info Component
const ConnectionInfo = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.3 }}
    className="rounded-xl p-3 bg-yellow-50/50 dark:bg-yellow-900/20 backdrop-blur-md border border-yellow-200/50 dark:border-yellow-700/30 flex items-center gap-3"
  >
    <AlertCircle
      size={16}
      className="text-yellow-600 dark:text-yellow-400 flex-shrink-0"
    />
    <p className="text-xs text-yellow-800 dark:text-yellow-200">
      Using free servers. It may take 15-30 seconds to find peers.
    </p>
  </motion.div>
);

// Received File Dialog Component
const ReceivedFileDialog = forwardRef(({ onClickSave }, ref) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleClickOpen = (file) => {
    setOpen(true);
    setFile(file);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    onClickSave();
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    handleClickOpen,
  }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative z-10 border border-white/50 dark:border-gray-700/50 shadow-xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle
              size={32}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            File Received
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {file?.name || "Unknown file"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium"
          >
            Dismiss
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium flex-1 flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Save File
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
});

// Server Side Component - We'll keep this as a separate import
const ServerSide = forwardRef((props, ref) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const peersRef = useRef([]);
  const allPeersRefTest = useRef([]);
  const downloadedFile = useRef();
  const spf = useRef(new SimplePeerFiles());
  const myIP = useRef("");

  var mySillyName = props.mySillyName;
  var selectedFile = props.selectedFile;

  useEffect(() => {
    func();
    async function func() {
      // Gather client's IP4
      await fetch(
        "https://boiled-industrious-contraption.glitch.me/https://api.ipify.org/?format=json"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((json) => {
          myIP.current = `${json.ip}`;
        })
        .catch(function () {
          this.dataError = true;
        });

      // Connection
      socketRef.current = io.connect("ws://breezy-fantasy-dive.glitch.me");
      await socketRef.current.on("connect", function () {
        console.log("Successfully connected to the server!");

        // Create me.
        const peer = new SimplePeer({ initiator: true, trickle: false });
        allPeersRefTest.current.push({
          peerID: socketRef.current.id,
          sillyName: mySillyName,
          isMobile: isMobile,
          peer,
        });
        console.log("ok");
        peer.on("signal", (data) => {
          // The signal data is generated here and can be passed to the other peer to establish the connection
          socketRef.current.emit("join room", {
            mySillyName,
            isMobile,
            myIP: myIP.current,
            signal: data,
          });
        });
      });

      // Create peers from server
      socketRef.current.on("all users", (users) => {
        console.log(users);
        var myId = socketRef.current.id;
        var indexOfMe = users.indexOf({ myId, mySillyName, isMobile });
        users.splice(indexOfMe, 1);
        const peers = [];
        users.forEach((userID) => {
          const peer = createPeer(
            userID.socketId,
            socketRef.current.id,
            userID.sillyName
          );
          peersRef.current.push({
            peerID: userID.socketId,
            sillyName: userID.sillyName,
            isMobile: userID.isMobile,
            peer,
          });
          peers.push(peer);
        });
        setPeers(peers);
      });

      // TESTING
      socketRef.current.on("all users test", (users) => {
        users.forEach((user) => {
          var check = false;
          check = allPeersRefTest.current.some(
            (u) => u.sillyName === user.sillyName
          )
            ? true
            : check;
          if (!check && !(socketRef.current.id == user.peerID)) {
            allPeersRefTest.current.push(user);
          }
        });
        socketRef.current.emit("sendMyArray", allPeersRefTest.current);
        console.log(allPeersRefTest.current);
      });

      socketRef.current.on("all users client", (users) => {
        users.forEach((user) => {
          var check = false;
          check = allPeersRefTest.current.some(
            (u) => u.sillyName === user.sillyName
          )
            ? true
            : check;
          if (!check && !(socketRef.current.id == user.peerID)) {
            allPeersRefTest.current.push(user);
          }
        });
        console.log(allPeersRefTest.current);
      });

      socketRef.current.on("user joined", (payload) => {
        if (payload.userToSignal != socketRef.current.id) {
          return;
        }
        const peer = addPeer(
          payload.signal,
          payload.callerID,
          payload.sillyName
        );
        peersRef.current.push({
          peerID: payload.callerID,
          sillyName: payload.sillyName,
          isMobile: payload.isMobile,
          peer,
        });
        setPeers((users) => [...users, peer]);
      });

      socketRef.current.on("receiving returned signal", (payload) => {
        const item = peersRef.current.find(
          (p) => p.peerID === payload.signalSender
        );
        item.peer.signal(payload.signal);
      });

      socketRef.current.on("remove disconnected", (id) => {
        const item = peersRef.current.find((p) => p.peerID === id);
        var indexOfDisconnected = peersRef.current.indexOf(item);
        peersRef.current.splice(indexOfDisconnected, 1);
        setPeers((prevPeers) => prevPeers.splice(indexOfDisconnected, 1));
      });
    }
  }, []);

  function createPeer(userToSignal, callerID) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
        mySillyName,
        isMobile,
        myIP: myIP.current,
      });
    });

    peer.on("data", (data) => {
      if (data.toString() === "1") {
        spf.current.receive(peer, "TEST").then((transfer) => {
          transfer.on("progress", (sentBytes) => {
            if (sentBytes === 100) {
              downloadedFile.current = new File(
                [new Blob(transfer.fileData, { type: transfer.type })],
                transfer.fileName
              );
              props.onFileReceive(downloadedFile.current);
            }
          });
        });
      }
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.on("data", (data) => {
      if (data.toString() === "1") {
        spf.current.receive(peer, "TEST").then((transfer) => {
          transfer.on("progress", (sentBytes) => {
            if (sentBytes === 100) {
              downloadedFile.current = new File(
                [new Blob(transfer.fileData, { type: transfer.type })],
                transfer.fileName
              );
              props.onFileReceive(downloadedFile.current);
            }
          });
        });
      }
    });

    peer.signal(incomingSignal);
    return peer;
  }

  useImperativeHandle(ref, () => ({
    handleClick() {
      const element = document.createElement("a");
      const file = downloadedFile.current;
      element.href = URL.createObjectURL(file);
      element.download = file.name;
      document.body.appendChild(element);
      element.click();
    },

    handlePeerClick(peer) {
      // peer is the SimplePeer object connection to receiver
      spf.current.send(peer, "TEST", selectedFile).then((transfer) => {
        transfer.on("progress", (sentBytes) => {
          console.log(sentBytes);
          console.log(transfer);
        });
        transfer.start();
      });
    },
  }));

  useEffect(() => {
    var peersMap = [...peersRef.current];
    props.returnUsers(peersMap);
  }, [peers]);

  return null;
});

// Main App Component
function App() {
  const mySillyName = useRef(generateStupidName());
  const [peers, setPeers] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const ServerSideRef = useRef();
  const dialogRef = useRef();
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [transferProgress, setTransferProgress] = useState({
    isVisible: false,
    progress: 0,
    fileName: "",
    isReceiving: false,
  });

  const isEmpty = selectedFile.length === 0;

  useEffect(() => {
    // Check system preference for dark mode
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDark(true);
    }

    // Add listener for changes in system preference
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        setIsDark(e.matches);
      });
  }, []);

  useEffect(() => {
    // Apply dark mode class to root html element
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const changeHandler = (file) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    setSelectedFileName(
      isEmpty ? "Drag and drop or select a file." : selectedFile.name
    );
  }, [selectedFile, isEmpty]);

  const returnUsersFunc = (arr) => {
    setPeers(arr);
  };

  const onSendClick = (sillyName) => {
    var peer = peers.find((p) => p.sillyName === sillyName).peer;
    console.log(selectedFile);
    peer.send("1");
    ServerSideRef.current.handlePeerClick(peer);

    // Show transfer progress
    setTransferProgress({
      isVisible: true,
      progress: 0,
      fileName: selectedFile.name,
      isReceiving: false,
    });

    // Simulate progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setTransferProgress((prev) => ({
        ...prev,
        progress: progress,
      }));

      if (progress >= 100) {
        clearInterval(interval);
        // Hide progress after completion and delay
        setTimeout(() => {
          setTransferProgress((prev) => ({
            ...prev,
            isVisible: false,
          }));
        }, 2000);
      }
    }, 300);
  };

  const onClickSave = () => {
    ServerSideRef.current.handleClick();
  };

  const onFileReceive = (file) => {
    dialogRef.current.handleClickOpen(file);
    console.log("received a file");

    // Show receiving progress
    setTransferProgress({
      isVisible: true,
      progress: 100, // Already complete when we get the notification
      fileName: file.name,
      isReceiving: true,
    });

    // Hide progress after delay
    setTimeout(() => {
      setTransferProgress((prev) => ({
        ...prev,
        isVisible: false,
      }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Add Google Fonts link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>
        {`
          body {
            font-family: 'Outfit', sans-serif;
          }
        `}
      </style>

      {/* Background Elements */}
      <BackgroundGradients isDark={isDark} />
      <GridOverlay isDark={isDark} />

      {/* Navbar */}
      <Navbar
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        onAboutClick={() => setIsAboutOpen(true)}
      />

      {/* Server Side Component (Hidden) */}
      <ServerSide
        ref={ServerSideRef}
        mySillyName={mySillyName.current}
        returnUsers={returnUsersFunc}
        selectedFile={selectedFile}
        onFileReceive={onFileReceive}
      />

      {/* Main Content */}
      <main className="pt-16 pb-6">
        {/* Top Section with User Identity */}
        <div className="max-w-5xl w-full mx-auto px-4 py-2 pb-6 flex justify-center mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-xl p-3 inline-flex items-center gap-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-indigo-500/10 dark:from-green-500/20 dark:to-indigo-500/20"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Connection status indicator */}
            <motion.div
              className="relative p-2 rounded-full bg-gradient-to-br from-green-400 to-green-500 dark:from-green-500 dark:to-green-600 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wifi size={16} className="text-white" />
              <motion.div
                className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-400 dark:bg-green-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.div>

            {/* Username text */}
            <div className="relative flex items-center gap-2">
              <span className="text-xl font-medium text-gray-800 dark:text-gray-200">
                Connected as
              </span>
              <motion.span
                className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {mySillyName.current}
              </motion.span>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-indigo-500/20 dark:bg-indigo-400/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -left-2 -bottom-2 w-4 h-4 rounded-full bg-green-500/20 dark:bg-green-400/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
            />
          </motion.div>
        </div>

        {/* App tagline */}
        <div className="max-w-5xl mx-auto px-4 text-center mt-2 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-4xl font-bold"
          >
            Share Files Instantly{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 text-transparent bg-clip-text">
              Without the Cloud
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 text-sm mt-2 max-w-xl mx-auto"
          >
            Securely transfer files between devices with end-to-end encryption.
            No servers, no storage limits.
          </motion.p>
        </div>

        {/* Main App Layout - Two Column Design */}
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-6">
          {/* Left Column - Device Animation */}
          <div className="md:w-1/2 flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-grow flex flex-col items-center justify-start"
            >
              <DeviceIllustrations />
            </motion.div>
          </div>

          {/* Right Column - Functional Elements */}
          <div className="md:w-1/2 space-y-4">
            {/* File Upload */}
            <FileCard
              onChangeEvent={changeHandler}
              fileName={selectedFileName}
              isEmpty={isEmpty}
            />

            {/* Available Devices */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/30 dark:border-gray-700/30 p-4 space-y-2"
            >
              <h2 className="text-base font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Wifi
                  size={16}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                Available Devices
              </h2>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                {peers.length > 0 ? (
                  peers.map((p) => (
                    <AvailableDevices
                      key={nanoid()}
                      deviceName={p.sillyName}
                      isMobile={p.isMobile}
                      sendStatus={!isEmpty}
                      onClickEvent={() => onSendClick(p.sillyName)}
                    />
                  ))
                ) : (
                  <SearchingDevices />
                )}
              </div>
            </motion.div>

            {/* Connection Info */}
            <ConnectionInfo />
          </div>
        </div>
      </main>

      {/* Transfer Progress Indicator */}
      <TransferProgress
        isVisible={transferProgress.isVisible}
        progress={transferProgress.progress}
        fileName={transferProgress.fileName}
        isReceiving={transferProgress.isReceiving}
      />

      {/* Received File Dialog */}
      <ReceivedFileDialog ref={dialogRef} onClickSave={onClickSave} />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}

export default App;
