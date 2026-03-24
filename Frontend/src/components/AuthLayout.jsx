import { motion } from "framer-motion";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f6fa] to-[#ecebff] px-4 relative overflow-hidden">
      
      {/* Animated background blob */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute w-[500px] h-[500px] bg-purple-500 rounded-full blur-3xl -top-40 -right-40"
      />

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold mb-1">
          uni<span className="text-purple-600">Bazaar</span>
        </h1>

        <h2 className="text-xl font-semibold mt-4">{title}</h2>
        <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;