'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { SettingsSchema } from '@/schemas';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { settings } from '@/actions/settings';
import { deleteAccount } from '@/actions/delete-account';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormSuccess from '@/components/form-success';
import FormError from '@/components/form-error';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/hooks/use-current-user';

const Settings = () => {
  const { user } = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      name: '',
      email: '',
      cppEmail: '',
    },
  });

  // Update form values when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        password: '',
        newPassword: '',
        name: user.name || '',
        email: user.email || '',
        cppEmail: user.cppEmail || '',
      });
    }
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setError(undefined);
    setSuccess(undefined);
    startTransition(() => {
      settings(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }

        if (data.success) {
          update();
          setSuccess(data.success);
        }
      });
    });
  };

  const handleAccountDeletion = () => {
    deleteAccount().then(async (data) => {
      if (data.error) {
        setError(data.error);
      }

      if (data.success) {
        setSuccess(data.success);
        await signOut();
      }
    });
  };

  return (
    <div className="flex items-center justify-center w-full max-w-2xl">
      <div className="w-full h-full p-6 mx-8">
        <div>
          {!user?.studentVerified && (
            <div className="mb-6 text-sm text-green-600 text-center">
              {user?.isOAuth
                ? 'Add your CPP student email (@cpp.edu) below to verify and create reviews.'
                : 'Update your email to a CPP student email, or add a CPP email below, to create reviews.'}
            </div>
          )}
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CPP email: OAuth users can add @cpp.edu to get studentVerified without replacing their OAuth email */}
                {(!user?.studentVerified || user?.cppEmail) && (
                  <FormField
                    control={form.control}
                    name="cppEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CPP Student Email (@cpp.edu)
                          {user?.cppEmail && (
                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                              (verified)
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="you@cpp.edu"
                            type="email"
                            disabled={isPending || !!user?.cppEmail}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {user?.isOAuth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="john.doe@example.com"
                              type="email"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="●●●●●●●●"
                              type="password"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="●●●●●●●●"
                              type="password"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <div className="flex justify-between">
                <Button
                  className="cursor-pointer"
                  disabled={isPending}
                  type="submit"
                >
                  Save
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="cursor-pointer"
                      type="button"
                      variant="destructive"
                    >
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete your account? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button className="cursor-pointer" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        className="cursor-pointer"
                        onClick={handleAccountDeletion}
                        type="button"
                        variant="destructive"
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
