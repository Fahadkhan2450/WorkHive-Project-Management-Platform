import { FaDownload } from "react-icons/fa"

const ReportCard = ({ title, description, icon, onDownload }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-full text-xl">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <p className="text-gray-500 mb-6">{description}</p>

      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md"
      >
        <FaDownload />
        Download Report
      </button>
    </div>
  )
}

export default ReportCard
