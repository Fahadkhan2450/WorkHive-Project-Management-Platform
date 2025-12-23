const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
      <div className="p-4 bg-blue-100 text-blue-600 rounded-full text-xl">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  )
}

export default StatCard
