import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';

export default forwardRef(function SelectInput(
    { className = '', options = [], placeholder = '', isFocused = false, ...props },
    ref
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 ' +
                className
            }
            ref={localRef}
        >
            {placeholder && (
                <option value="">{placeholder}</option>
            )}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});
