"use client";

import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function BuyerLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4">
            <ImageWithFallback
              src="https://kxvyveizgrnieetbttjx.supabase.co/storage/v1/object/public/Banners%20and%20Logos/logo/Logo%20Lumi.png"
              alt="Logo Lumi"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acesse sua conta
          </h2>
        </div>

        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(221.2 83.2% 53.3%)", // Cor primária azul
                  brandAccent: "hsl(221.2 83.2% 40%)",
                },
              },
            },
          }}
          theme="light"
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Entrar",
                social_provider_text: "Entrar com {{provider}}",
                link_text: "Já tem uma conta? Entre",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Cadastrar",
                link_text: "Não tem uma conta? Cadastre-se",
              },
              forgotten_password: {
                link_text: "Esqueceu sua senha?",
              },
            },
          }}
        />
      </div>
    </div>
  );
}