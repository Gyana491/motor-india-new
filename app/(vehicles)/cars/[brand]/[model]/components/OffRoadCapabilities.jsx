export default function OffRoadCapabilities({ isOffRoader }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Off-Road Capabilities</h2>
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{isOffRoader ? "4x4" : "2WD"}</div>
            <p className="text-gray-300">Drivetrain</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">High</div>
            <p className="text-gray-300">Ground Clearance</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">✓</div>
            <p className="text-gray-300">Adventure Ready</p>
          </div>
        </div>
      </div>
    </section>
  );
} 