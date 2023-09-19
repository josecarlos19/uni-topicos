import {
  DeepPartial,
  DefaultValues,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type FormValues = Record<string, any>;

export function useFormWithSchema<T extends FormValues>(
  schema: Yup.AnyObjectSchema,
  defaultValues?: DeepPartial<T>,
): UseFormReturn<T> {
  return useForm<T>({
    defaultValues: defaultValues as DefaultValues<T> | undefined,
    resolver: yupResolver(schema),
  });
}
