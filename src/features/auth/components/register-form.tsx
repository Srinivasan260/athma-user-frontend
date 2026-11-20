import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import {
  registerSchema,
  type RegisterFormInput,
  type RegisterFormValues,
} from '../schemas/register.schema';
import { FormField, SectionTitle } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PasswordInput } from '@/components/ui/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from '@/constants';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isSubmitting?: boolean;
}

export function RegisterForm({ onSubmit, isSubmitting }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInput, unknown, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { consent: false as unknown as true },
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal info */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Full name" htmlFor="fullName" required error={errors.fullName?.message}>
          <Input
            id="fullName"
            placeholder="Full Name"
            invalid={!!errors.fullName}
            {...register('fullName')}
          />
        </FormField>

        <FormField label="Age" htmlFor="age" required error={errors.age?.message}>
          <Input
            id="age"
            type="number"
            placeholder="Age"
            invalid={!!errors.age}
            {...register('age')}
          />
        </FormField>

        <FormField label="Gender" htmlFor="gender" required error={errors.gender?.message}>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                id="gender"
                options={GENDER_OPTIONS}
                placeholder="Select"
                invalid={!!errors.gender}
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>

        <FormField label="Phone" htmlFor="phone" required error={errors.phone?.message}>
          <Input
            id="phone"
            placeholder="Phone Number"
            invalid={!!errors.phone}
            {...register('phone')}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="email"
          required
          error={errors.email?.message}
          className="sm:col-span-2 lg:col-span-2"
        >
          <Input
            id="email"
            type="email"
            placeholder="Email"
            invalid={!!errors.email}
            {...register('email')}
          />
        </FormField>
      </div>

      {/* Address */}
      <FormField
        label="Full Address"
        htmlFor="address"
        required
        error={errors.address?.message}
      >
        <Textarea
          id="address"
          placeholder="House/Flat No., Street, Area, Landmark"
          invalid={!!errors.address}
          {...register('address')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="City" htmlFor="city" required error={errors.city?.message}>
          <Input id="city" placeholder="City" invalid={!!errors.city} {...register('city')} />
        </FormField>

        <FormField label="State" htmlFor="state" required error={errors.state?.message}>
          <Input id="state" placeholder="State" invalid={!!errors.state} {...register('state')} />
        </FormField>

        <FormField label="Pincode" htmlFor="pincode" required error={errors.pincode?.message}>
          <Input
            id="pincode"
            inputMode="numeric"
            placeholder="6-digit pincode"
            invalid={!!errors.pincode}
            {...register('pincode')}
          />
        </FormField>

        <FormField label="Location" htmlFor="location" required error={errors.location?.message}>
          <Input
            id="location"
            placeholder="District/Area"
            invalid={!!errors.location}
            {...register('location')}
          />
        </FormField>
      </div>

      {/* About you */}
      <SectionTitle>About you</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="Marital status" htmlFor="maritalStatus">
          <Controller
            control={control}
            name="maritalStatus"
            render={({ field }) => (
              <Select
                id="maritalStatus"
                options={MARITAL_STATUS_OPTIONS}
                placeholder="Select"
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>

        <FormField label="Education" htmlFor="education">
          <Input id="education" placeholder="e.g. B.E, B.Sc, M.A" {...register('education')} />
        </FormField>

        <FormField label="Occupation" htmlFor="occupation">
          <Input id="occupation" placeholder="e.g. Engineer, Student" {...register('occupation')} />
        </FormField>

        <FormField label="Referred By" htmlFor="referredBy" optional>
          <Input id="referredBy" placeholder="Doctor/Clinic/Person" {...register('referredBy')} />
        </FormField>
      </div>

      {/* Account security */}
      <SectionTitle>Account security</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Password"
          htmlFor="password"
          required
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            placeholder="At least 8 characters"
            invalid={!!errors.password}
            autoComplete="new-password"
            {...register('password')}
          />
        </FormField>

        <FormField
          label="Confirm password"
          htmlFor="confirmPassword"
          required
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            invalid={!!errors.confirmPassword}
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
        </FormField>
      </div>

      {/* Consent */}
      <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-0.5"
              />
            )}
          />
          <span className="text-sm text-ink-700">
            I confirm that the information provided above is true and accurate to the best of my
            knowledge, and I consent to Athma Mind Care Hospital using it for my care.
          </span>
        </label>
        {errors.consent && (
          <p className="ml-8 mt-1 text-xs text-red-500">{errors.consent.message}</p>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          rightIcon={<ArrowRight className="h-4 w-4" />}
          isLoading={isSubmitting}
          className="min-w-[220px]"
        >
          Register
        </Button>
      </div>
    </form>
  );
}
