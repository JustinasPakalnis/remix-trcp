import { trpc } from "~/utils/trpc";
import { useState } from "react";

export default function Index() {
  const { data: history, isLoading: historyLoading } =
    trpc.history.getAllHistory.useQuery();
  const { data: items, isLoading: itemsLoading } =
    trpc.item.getAllItems.useQuery();

  const trpcContext = trpc.useContext();

  const { mutate: insertItem, isLoading: isInsertingItem } =
    trpc.item.insertItem.useMutation({
      onSuccess: () => {
        trpcContext.item.getAllItems.invalidate();
      },
    });

  const { mutate: insertHistory, isLoading: isInsertingHistory } =
    trpc.history.insertHistory.useMutation({
      onSuccess: () => {
        trpcContext.history.getAllHistory.invalidate();
      },
    });

  const [formData, setFormData] = useState({
    title: "",
    value: 0,
  });

  const [historyData, setHistoryData] = useState({
    name: "",
    comment: "",
    itemId: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "value" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleHistoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setHistoryData((prev) => ({
      ...prev,
      [name]:
        name === "value"
          ? parseFloat(value) || 0
          : name === "itemId"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.value <= 0) {
      alert("Title and Value are required.");
      return;
    }

    insertItem(formData);
    setFormData({
      title: "",
      value: 0,
    });
  };

  const handleHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!historyData.name || !historyData.itemId) {
      alert("Name, Value, and Item selection are required.");
      return;
    }

    insertHistory(historyData);
    setHistoryData({
      name: "",
      comment: "",
      itemId: 0,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Items and History</h2>

      {/* Add New Item Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Item
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700"
            >
              Value
            </label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
            disabled={isInsertingItem}
          >
            {isInsertingItem ? "Saving..." : "Add Item"}
          </button>
        </form>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Items</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">
                Item Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">
                Item Value
              </th>
            </tr>
          </thead>
          <tbody>
            {itemsLoading ? (
              <tr>
                <td colSpan={2} className="px-6 py-3 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              items?.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {item.title}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {item.value}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Insert History Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Insert History
        </h3>
        <form onSubmit={handleHistorySubmit}>
          <div className="mb-4">
            <label
              htmlFor="itemId"
              className="block text-sm font-medium text-gray-700"
            >
              Select Item
            </label>
            <select
              id="itemId"
              name="itemId"
              value={historyData.itemId}
              onChange={handleHistoryInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select an Item</option>
              {items?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={historyData.name}
              onChange={handleHistoryInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment
            </label>
            <input
              type="text"
              id="comment"
              name="comment"
              value={historyData.comment}
              onChange={handleHistoryInputChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
            disabled={isInsertingHistory}
          >
            {isInsertingHistory ? "Saving..." : "Add History"}
          </button>
        </form>
      </div>
      {/* History Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">History</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">
                History ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 border-b">
                Item ID
              </th>
            </tr>
          </thead>
          <tbody>
            {historyLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-3 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              history?.map((hist) => (
                <tr key={hist.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-700">{hist.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {hist.comment}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {hist.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {hist.itemId}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
