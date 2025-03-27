
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, ShoppingBag, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const provinsiIndonesia = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bangka Belitung",
  "Bengkulu",
  "Lampung",
  "DKI Jakarta",
  "Banten",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Gorontalo",
  "Sulawesi Tengah",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
];

const formSchema = z.object({
  nama: z.string().min(3, { message: "Nama harus diisi minimal 3 karakter" }),
  noHp: z.string().min(10, { message: "Nomor HP harus diisi dengan benar" }),
  provinsi: z.string().min(1, { message: "Provinsi harus dipilih" }),
  kota: z.string().min(1, { message: "Kota harus diisi" }),
  kodePos: z.string().min(5, { message: "Kode pos harus diisi" }),
  alamatLengkap: z.string().min(10, { message: "Alamat lengkap harus diisi" }),
  metodePembayaran: z.enum(["tf", "cod"], {
    required_error: "Metode pembayaran harus dipilih",
  }),
  catatanPesanan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage: React.FC = () => {
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      noHp: "",
      provinsi: "",
      kota: "",
      kodePos: "",
      alamatLengkap: "",
      metodePembayaran: "tf",
      catatanPesanan: "",
    },
  });

  // Cek jika keranjang kosong, redirect ke halaman keranjang
  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleCheckout = (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Format pesanan untuk WhatsApp
      const waNumber = "628115554155";
      
      let pesananText = `*PESANAN BARU*\n\n`;
      pesananText += `*Detail Pelanggan:*\n`;
      pesananText += `Nama: ${values.nama}\n`;
      pesananText += `No HP: ${values.noHp}\n`;
      pesananText += `Alamat: ${values.alamatLengkap}, ${values.kota}, ${values.provinsi} ${values.kodePos}\n\n`;
      
      pesananText += `*Detail Pesanan:*\n`;
      
      cartItems.forEach((item, index) => {
        pesananText += `${index + 1}. ${item.product.name} (${item.quantity} x Rp${Math.round(item.product.price * 15000).toLocaleString('id-ID')}) = Rp${Math.round(item.product.price * item.quantity * 15000).toLocaleString('id-ID')}\n`;
      });
      
      pesananText += `\n*Total: Rp${Math.round(totalPrice * 15000).toLocaleString('id-ID')}*\n\n`;
      pesananText += `*Metode Pembayaran:* ${values.metodePembayaran === 'tf' ? 'Transfer Bank' : 'COD (Cash On Delivery)'}\n`;
      
      if (values.catatanPesanan) {
        pesananText += `\n*Catatan:* ${values.catatanPesanan}\n`;
      }
      
      // Encode pesanan untuk URL WhatsApp
      const encodedPesanan = encodeURIComponent(pesananText);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedPesanan}`;
      
      // Bersihkan keranjang
      clearCart();
      
      // Buka WhatsApp di tab baru
      window.open(waUrl, "_blank");

      // Tampilkan toast sukses dan redirect ke halaman utama
      toast({
        title: "Pesanan Berhasil",
        description: "Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan",
      });

      // Redirect ke halaman utama setelah 2 detik
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("Error processing checkout:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal memproses pesanan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Return null or loading spinner karena akan redirect
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Link
        to="/cart"
        className="inline-flex items-center text-ahsan-merah mb-8 hover:text-ahsan-merah-tua transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Kembali ke Keranjang</span>
      </Link>

      <h1 className="heading-primary mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="font-serif text-xl font-medium mb-6">
              Informasi Pengiriman
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCheckout)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama lengkap" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noHp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor HP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: 08123456789"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="provinsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih provinsi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinsiIndonesia.map((provinsi) => (
                              <SelectItem key={provinsi} value={provinsi}>
                                {provinsi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kota"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota/Kabupaten</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan kota/kabupaten" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="kodePos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Pos</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan kode pos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="alamatLengkap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, dll)"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-white rounded-xl p-6">
                  <h2 className="font-serif text-xl font-medium mb-6">
                    Metode Pembayaran
                  </h2>

                  <FormField
                    control={form.control}
                    name="metodePembayaran"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <RadioGroupItem value="tf" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex-1">
                                Transfer Bank (Bayar setelah konfirmasi via WhatsApp)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <RadioGroupItem value="cod" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex-1">
                                COD (Cash On Delivery)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="catatanPesanan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catatan Pesanan (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tambahkan catatan untuk pesanan Anda"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 md:hidden">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-ahsan-merah hover:bg-ahsan-merah-tua transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send size={18} />
                    )}
                    <span>Proses Pesanan via WhatsApp</span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="font-serif text-xl font-medium mb-6">Ringkasan Pesanan</h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">{item.quantity} x Rp{Math.round(item.product.price * 15000).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="text-right font-medium">
                    Rp{Math.round(item.product.price * item.quantity * 15000).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rp{Math.round(totalPrice * 15000).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pengiriman</span>
                <span className="text-gray-600">Dihitung setelah konfirmasi</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-ahsan-merah">
                  Rp{Math.round(totalPrice * 15000).toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                *Belum termasuk biaya pengiriman
              </p>
            </div>

            <div className="mt-6 hidden md:block">
              <Button
                type="submit"
                onClick={form.handleSubmit(handleCheckout)}
                disabled={isSubmitting}
                className="w-full bg-ahsan-merah hover:bg-ahsan-merah-tua transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send size={18} />
                )}
                <span>Proses Pesanan via WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
