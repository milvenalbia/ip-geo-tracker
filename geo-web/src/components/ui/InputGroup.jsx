const InputGroup = ({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  handleInputChange,
  required = false,
}) => {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition'
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default InputGroup;
