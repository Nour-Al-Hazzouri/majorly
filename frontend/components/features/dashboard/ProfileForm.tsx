'use client';

import { profileUpdateSchema, ProfileUpdateInput } from "@/lib/validations/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
    user: any;
    onUpdate: () => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProfileUpdateInput>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            password_confirmation: "",
        },
    });

    const onSubmit = async (values: ProfileUpdateInput) => {
        setIsSubmitting(true);
        try {
            // Clean up password if empty
            const data: any = {
                name: values.name,
                email: values.email,
            };

            if (values.password) {
                data.password = values.password;
                data.password_confirmation = values.password_confirmation;
            }

            await api.patch('/api/profile', data);
            toast.success("Profile updated successfully!");
            onUpdate();
            form.reset({ ...values, password: "", password_confirmation: "" });
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to update profile";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-medium text-slate-900 mb-4">Change Password (optional)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </form>
        </Form>
    );
}
