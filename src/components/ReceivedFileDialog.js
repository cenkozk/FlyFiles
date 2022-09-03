import React, { forwardRef, useImperativeHandle } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ReceivedFileDialog(props, ref) {
  const [open, setOpen] = React.useState(false);
  const [file, setfile] = React.useState(null);
  var fileName = file === null ? "" : file.name;

  const handleClickOpen = (file) => {
    setOpen(true);
    setfile(file);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSave = () => {
    setOpen(false);
    props.onClickSave();
  };

  useImperativeHandle(ref, () => ({
    handleClickOpen,
  }));

  const raleway = "'Raleway', sans-serif";

  return (
    <div>
      <Dialog
        PaperProps={{ style: { borderRadius: "20px" } }}
        sx={{ backdropFilter: "blur(8px)" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ fontFamily: raleway, fontWeight: "800", WebkitUserSelect: "none", color: "#3E3E3E" }} id="alert-dialog-title">
          {"Received a file."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: raleway, fontWeight: "500", color: "#3E3E3E" }} id="alert-dialog-description">
            {fileName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ borderRadius: "20px", fontFamily: raleway, fontWeight: "800", color: "#E76D61" }} onClick={handleClose}>
            Close
          </Button>
          <Button sx={{ borderRadius: "20px", fontFamily: raleway, fontWeight: "800", color: "#E76D61" }} onClick={handleCloseSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default forwardRef(ReceivedFileDialog);
