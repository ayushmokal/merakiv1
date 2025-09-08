'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useState } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^\+?[\d\s\-()\/]+$/, 'Use numbers, spaces, +, -, (), or /'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(1, 'Please describe your enquiry'),
  interest: z.string().optional().default(''),
  budget_range: z.string().optional().default(''),
});

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
      interest: '',
      budget_range: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: 'Thank you!',
          description: "We'll be in touch with you soon with exclusive offers.",
        });
        localStorage.setItem('leadModalSeen', 'true');
        localStorage.setItem('leadModalTimestamp', Date.now().toString());
        onClose();
        form.reset();
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to submit');
      }
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotNow = () => {
    const email = form.getValues('email');
    const name = form.getValues('name') || 'Not provided';
    if (email) {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: form.getValues('phone') || '',
          message: form.getValues('message') || '',
          interest: 'Deferred',
          budget_range: form.getValues('budget_range') || '',
        }),
      }).catch(() => {});
    }
    localStorage.setItem('leadModalSeen', 'true');
    localStorage.setItem('leadModalTimestamp', Date.now().toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="
          p-0 overflow-hidden z-[101]
          max-h-[86vh] max-h-[86dvh] sm:max-h-[88vh] sm:max-h-[88dvh]
          w-full md:w-[94vw] md:max-w-md
          left-0 right-0 bottom-0 top-auto translate-x-0 translate-y-0 rounded-t-2xl rounded-b-0
          md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:mx-4
        ">
        <div className="flex flex-col h-full">
          <div className="px-4 pt-4">
            <DialogHeader>
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <DialogTitle className="text-base sm:text-xl leading-tight">Premium Property Consultation!</DialogTitle>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="px-4">
            <div className="bg-primary/5 p-2 rounded-lg">
              <p className="text-[11px] sm:text-xs text-center leading-tight">
                <strong>Get Expert Property Consultation</strong> +
                <strong> Professional Market Analysis</strong>
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2" data-form-tracked>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your full name"
                            className="h-10 text-[16px] sm:text-sm border-0 bg-muted/50 shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Phone Number *</FormLabel>
                        <FormControl>
                        <Input
                          {...field}
                          inputMode="tel"
                          pattern="[+0-9()\-\s/]*"
                          placeholder="9930910004 / 9820274467"
                          className="h-10 text-[16px] sm:text-sm border-0 bg-muted/50 shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0"
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Email *</FormLabel>
                      <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="merakisquarefootsllp@gmail.com"
                        className="h-10 text-[16px] sm:text-sm border-0 bg-muted/50 shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0"
                      />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Enquiry Details *</FormLabel>
                      <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="Tell us about your property requirements..."
                        className="text-[16px] sm:text-sm resize-none min-h-[64px] border-0 bg-muted/50 shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0"
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                      />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel className="text-xs sm:text-sm">I&apos;m interested in</FormLabel>
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                        >
                          <FormControl>
                          <SelectTrigger className="h-10 sm:h-10 text-[16px] sm:text-sm border-0 bg-muted/50 shadow-inner focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rcc-consultancy">RCC Consultancy</SelectItem>
                            <SelectItem value="property-consultancy">Property Consultancy</SelectItem>
                            <SelectItem value="interior-design">Interior Design</SelectItem>
                            <SelectItem value="villa-management">Villa Management</SelectItem>
                            <SelectItem value="property-management">Property Management</SelectItem>
                            <SelectItem value="multiple">Multiple Services</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel className="text-xs sm:text-sm">Budget Range</FormLabel>
                  <FormField
                    control={form.control}
                    name="budget_range"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                        >
                          <FormControl>
                          <SelectTrigger className="h-10 sm:h-10 text-[16px] sm:text-sm border-0 bg-muted/50 shadow-inner focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under-5l">Under ₹5 Lakhs</SelectItem>
                            <SelectItem value="5l-15l">₹5 - 15 Lakhs</SelectItem>
                            <SelectItem value="15l-50l">₹15 - 50 Lakhs</SelectItem>
                            <SelectItem value="50l-1cr">₹50 Lakhs - 1 Crore</SelectItem>
                            <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="text-[11px] text-muted-foreground text-center pt-1 px-1">
                  By submitting, you agree to receive updates about our services. We respect your privacy.
                </div>
                
                {/* Spacer so last field isn't hidden behind sticky footer */}
                <div className="h-3" />

                {/* Sticky action bar */}
                <div className="sticky bottom-0 left-0 right-0 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-t mt-2">
                  <div className="flex space-x-3 pt-1.5 pb-2 safe-area-pb">
                    <Button type="submit" disabled={isSubmitting} className="flex-1 h-10">
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleNotNow} className="h-10">
                      Not Now
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
