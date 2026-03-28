import { useState, useCallback, useRef, useEffect } from 'react';

// ─── useAsync: manages loading/error/data for async ops ──────────────────
export function useAsync(asyncFn, immediate = false) {
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await asyncFn(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        setState({ data: null, loading: false, error: error.message });
        throw error;
      }
    },
    [asyncFn]
  );

  return { ...state, execute };
}

// ─── useControlledForm: controlled form state management ─────────────────
export function useControlledForm(initialValues, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validators[field]) {
      const error = validators[field](values[field], values);
      setErrors((prev) => ({ ...prev, [field]: error || null }));
    }
  }, [validators, values]);

  const validate = useCallback(() => {
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      const error = validators[field](values[field], values);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    setTouched(Object.keys(validators).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return Object.keys(newErrors).length === 0;
  }, [validators, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (onSubmit) => {
      if (!validate()) return;
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        reset();
      } catch (err) {
        setErrors((prev) => ({ ...prev, _form: err.message }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, onSubmit, values, reset]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    validate,
    reset,
    handleSubmit,
    setIsSubmitting,
  };
}

// ─── useIntersectionObserver: for lazy/virtual rendering ─────────────────
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
}

// ─── useDebounce ──────────────────────────────────────────────────────────
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── useKeyboard: keyboard navigation helper ──────────────────────────────
export function useKeyboard(keyMap) {
  useEffect(() => {
    const handler = (e) => {
      const action = keyMap[e.key];
      if (action) {
        e.preventDefault();
        action(e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyMap]);
}

// ─── useLocalStorage ──────────────────────────────────────────────────────
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  return [value, setStoredValue];
}
