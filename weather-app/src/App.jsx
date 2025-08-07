import { useState, useEffect } from "react"

const API_KEY = import.meta.env.VITE_API_KEY

function App() {
  const [city, setCity] = useState("")
  const [error, setError] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [unit, setUnit] = useState("metric") 

  const fetchWeather = async () => {
    if (!city) return

    setLoading(true)
    setError("")
    setWeather(null)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      )

      if (!res.ok) {
        if (res.status === 404) throw new Error("ไม่พบเมืองนี้")
        else throw new Error("เกิดข้อผิดพลาด")
      }
      const data = await res.json()
      setWeather(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Re-fetch 
  useEffect(() => {
    if (weather) {
      fetchWeather()
    }
  
  }, [unit])


  const getBgClass = () => {
    if (!weather) return "bg-white"

    const main = weather.weather[0].main.toLowerCase()
    if (main.includes("cloud")) return "bg-gray-300"
    if (main.includes("rain")) return "bg-blue-800"
    if (main.includes("clear")) return "bg-yellow-100"
    if (main.includes("snow")) return "bg-gray-100"
    if (main.includes("thunder")) return "bg-indigo-700 text-white"

    return "bg-white"
  }


  return (
    <div className={`${getBgClass()} min-h-screen flex flex-col items-center justify-center   transition-all duration-500`}>
      <div className="bg-white/80 backdrop-blur-md p-7 rounded-lg -mt-20 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Weather App</h1>
        <p className="text-center text-gray-600 mb-2">กรอกชื่อเมืองเพื่อตรวจสอบอากาศ</p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
             onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                fetchWeather()
              }
            }}
            placeholder="Enter city name"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
            className="bg-{} text-sm text-yellow-600  underline mx-4 cursor-pointer"
          >
            หน่วย {unit === "metric" ? "°F" : "°C"}
          </button>

          <button
            onClick={fetchWeather}
            className="bg-yellow-300 text-gray-600 px-4 py-2 rounded hover:bg-yellow-400 cursor-pointer"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
           </div>
                 <div className="flex items-start justify-center mt-10">
           {weather && (
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold">{weather.name}</h2>
               <img
              className="mx-auto"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
              <p className="text-4xl">
                {weather.main.temp}°{unit === "metric" ? "C" : "F"}
              </p>
            <p className="capitalize">{weather.weather[0].description}</p>
            <p>ความชื้น: {weather.main.humidity}%</p>
            <p>ลม: {weather.wind.speed} m/s</p>
               
        </div>
         )}
      </div>
    </div>
  )
}

export default App
