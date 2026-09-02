import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft, Shield} from "lucide-react";
import {Link} from "react-router-dom";
import {useCountry} from "@/contexts/CountryContext";

type Section = {
  title: string;
  body: React.ReactNode;
};

const Privacy = () => {
  const {isUSA} = useCountry();

  const sectionsPT: Section[] = [
    {
      title: "1. Informações Gerais",
      body: (
        <p>
          O aplicativo <strong>Mamãe Zen</strong> foi desenvolvido para auxiliar mamães no cuidado com seus bebês,
          oferecendo guias práticos, ferramentas de acompanhamento e recursos educacionais.
        </p>
      ),
    },
    {
      title: "2. Coleta de Dados",
      body: (
        <>
          <p className="mb-2">Este aplicativo coleta e armazena localmente em seu dispositivo:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Seu nome (informado voluntariamente)</li>
            <li>Registros de sono do bebê</li>
            <li>Registros de alimentação</li>
            <li>Preferências de uso do aplicativo</li>
          </ul>
          <p className="mt-2">
            <strong>Importante:</strong> Esses dados ficam no seu dispositivo, através do localStorage do navegador.
            Dados de conta (e-mail e licença) são usados apenas para autenticar seu acesso.
          </p>
        </>
      ),
    },
    {
      title: "3. Geolocalização",
      body: (
        <p>
          O aplicativo pode solicitar acesso à sua localização para mostrar hospitais e clínicas próximas em caso de
          emergência. Esta funcionalidade é opcional e você pode recusar o acesso a qualquer momento. A localização não
          é armazenada nem compartilhada.
        </p>
      ),
    },
    {
      title: "4. Cookies e Armazenamento Local",
      body: (
        <p>
          Utilizamos o localStorage do navegador para salvar suas preferências e dados de uso. Você pode limpar esses
          dados a qualquer momento pelas configurações do seu navegador.
        </p>
      ),
    },
    {
      title: "5. Segurança",
      body: (
        <p>
          Como grande parte dos dados fica armazenada localmente, a segurança também depende da proteção do seu
          aparelho. Recomendamos manter seu dispositivo seguro e atualizado.
        </p>
      ),
    },
    {
      title: "6. Links Externos",
      body: (
        <p>
          O aplicativo pode conter links para sites externos (como o Google Maps para rotas). Não somos responsáveis
          pelas políticas de privacidade desses sites.
        </p>
      ),
    },
    {
      title: "7. Alterações na Política",
      body: (
        <p>
          Esta política de privacidade pode ser atualizada periodicamente. Recomendamos que você a revise regularmente
          para estar ciente de quaisquer mudanças.
        </p>
      ),
    },
    {
      title: "8. Isenção de Responsabilidade",
      body: (
        <p>
          Este aplicativo fornece informações educacionais e não substitui consultas médicas profissionais. Sempre
          consulte um pediatra ou médico qualificado para questões relacionadas à saúde do seu bebê.
        </p>
      ),
    },
    {
      title: "9. Contato",
      body: (
        <p>
          Para dúvidas sobre esta política de privacidade, entre em contato através do desenvolvedor do aplicativo.
        </p>
      ),
    },
  ];

  const sectionsEN: Section[] = [
    {
      title: "1. General Information",
      body: (
        <p>
          The <strong>Mamãe Zen</strong> app was created to support moms caring for their babies, offering practical
          guides, tracking tools and educational resources.
        </p>
      ),
    },
    {
      title: "2. Data We Collect",
      body: (
        <>
          <p className="mb-2">This app collects and stores locally on your device:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Your name (provided voluntarily)</li>
            <li>Baby sleep records</li>
            <li>Feeding records</li>
            <li>App usage preferences</li>
          </ul>
          <p className="mt-2">
            <strong>Important:</strong> This data stays on your device through the browser's localStorage. Account data
            (email and license) is used only to authenticate your access.
          </p>
        </>
      ),
    },
    {
      title: "3. Geolocation",
      body: (
        <p>
          The app may request access to your location to show nearby hospitals and clinics during an emergency. This
          feature is optional and you can deny access at any time. Your location is not stored or shared.
        </p>
      ),
    },
    {
      title: "4. Cookies and Local Storage",
      body: (
        <p>
          We use the browser's localStorage to save your preferences and usage data. You can clear this data at any
          time through your browser settings.
        </p>
      ),
    },
    {
      title: "5. Security",
      body: (
        <p>
          Because most data is stored locally, security also depends on protecting your own device. We recommend
          keeping your device secure and up to date.
        </p>
      ),
    },
    {
      title: "6. External Links",
      body: (
        <p>
          The app may contain links to external sites (such as Google Maps for directions). We are not responsible for
          the privacy practices of those sites.
        </p>
      ),
    },
    {
      title: "7. Policy Changes",
      body: (
        <p>
          This privacy policy may be updated periodically. We recommend reviewing it regularly so you stay aware of any
          changes.
        </p>
      ),
    },
    {
      title: "8. Disclaimer",
      body: (
        <p>
          This app provides educational information and does not replace professional medical advice. Always consult a
          pediatrician or qualified doctor about your baby's health.
        </p>
      ),
    },
    {
      title: "9. Contact",
      body: <p>For questions about this privacy policy, please contact the app developer.</p>,
    },
  ];

  const sections = isUSA ? sectionsEN : sectionsPT;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6 py-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            {isUSA ? "Back" : "Voltar"}
          </Button>
        </Link>

        <Card className="bg-card border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">
                {isUSA ? "Privacy Policy" : "Política de Privacidade"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-primary mb-2">{section.title}</h2>
                {section.body}
              </section>
            ))}

            <div className="pt-6 border-t space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                <strong>{isUSA ? "Last updated:" : "Última atualização:"}</strong>{" "}
                {new Date().toLocaleDateString(isUSA ? "en-US" : "pt-BR")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm font-semibold">© {new Date().getFullYear()} Mamãe Zen Premium</p>
            <p className="text-xs text-muted-foreground">
              {isUSA ? "All rights reserved to" : "Todos os direitos reservados a"}{" "}
              <strong className="text-primary">Hemerson Deckson</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              {isUSA ? "Developed by" : "Desenvolvido por"}{" "}
              <strong className="text-primary">Hemerson Deckson</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
