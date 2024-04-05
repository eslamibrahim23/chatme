import React from "react";
import { Dialog } from "@headlessui/react";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center"
      open={isOpen}
      onClose={onCancel}
    >
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

      <div className="bg-gray-700 rounded-lg p-4 w-80">
        {" "}
        {/* Change bg color here */}
        <Dialog.Title as="h3" className="text-lg font-medium mb-4">
          Are you sure you want to delete your profile 😕?
        </Dialog.Title>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-4"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationModal;
