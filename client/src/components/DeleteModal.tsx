interface DeleteModalProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal = ({
  name,
  onConfirm,
  onCancel,
}: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 mx-4 bg-white shadow-xl rounded-2xl">
        <h3 className="mb-2 text-base font-bold text-gray-900">
          Delete Lead
        </h3>

        <p className="mb-6 text-sm text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">
            {name}
          </span>
          ? This cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white transition-colors bg-red-500 rounded-xl hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;