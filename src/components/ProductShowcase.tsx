import {openInApp} from"@/lib/inAppBrowser";
import {useCountry} from'@/contexts/CountryContext';
import {Card} from'@/components/ui/card';
import {Button} from'@/components/ui/button';
import {Badge} from'@/components/ui/badge';
import {ShoppingBag, ExternalLink, Star, TrendingUp} from'lucide-react';

const STORE_URL ='https://collshp.com/mamaezenshopping';

const products = [
 {
 id: 1,
 name:'Macacão bebê com vestido/usa separado Manuela',
 price:'R$ 78,90',
 image:'https://down-bs-br.img.susercontent.com/br-11134211-7qukw-lix4vtcc8pz346.avif',
 discount:'-20%',
 sold:'2mil+ Vendidos',
},
 {
 id: 2,
 name:'Saída de Maternidade de Luxo MENINA Kit Completo',
 price:'R$ 116,48',
 image:'https://down-bs-br.img.susercontent.com/br-11134207-820lc-mlc2kifpdfd13b.avif',
 discount:'-22%',
 sold:'2mil+ Vendidos',
},
 {
 id: 3,
 name:'Saída de Maternidade Luxo Menina Kit 5 Peças - 100% Algodão',
 price:'R$ 180,41',
 image:'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-mkifnvsnmdc210.avif',
 discount:'-5%',
 sold:'582 Vendidos',
},
 {
 id: 4,
 name:'Body Temático Bolofofo Mesversário Bebê Menina/Menino Polvo/Gatinha',
 price:'R$ 24,90',
 image:'https://down-bs-br.img.susercontent.com/br-11134207-81ztc-miuklvbu8b2abb.avif',
 discount: null,
 sold:'835 Vendidos',
},
 {
 id: 5,
 name:'Body Bebê Feminino Menina Temático Mesversário 100% Algodão',
 price:'R$ 9,81',
 image:'https://down-bs-br.img.susercontent.com/br-11134207-81z1k-mesz50q076ddcd.avif',
 discount:'-1%',
 sold:'3mil+ Vendidos',
},
 {
 id: 6,
 name:'Macacão Manga Longa Bebê Menina com Lacinhos em Malha Manu Rosê/Pink/Vermelho/Rosa/Marsala',
 price:'R$ 54,00',
 image:'https://down-bs-br.img.susercontent.com/br-11134207-7r98o-mbsckuztbwyv4d.avif',
 discount:'-20%',
 sold:'3mil+ Vendidos',
},
];

const ProductShowcase = () => {
 const {isUSA} = useCountry();

 const handleBuyProduct = () => {
 openInApp(STORE_URL,'Lojinha da Mamãe');
};

 return (
 <Card className="p-4 bg-card border-border">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2">
 <ShoppingBag className="w-5 h-5 text-primary"/>
 <h3 className="font-bold text-lg text-foreground">
 {isUSA?'Mom Shop':'Lojinha da Mamãe'}
 </h3>
 </div>
 <Badge variant="secondary"className="text-[10px] font-semibold">
 {isUSA?'Official store':'Loja oficial'}
 </Badge>
 </div>

 <p className="text-xs text-muted-foreground mb-4">
 {isUSA
?'Curated products for your baby — tap to buy!':'Produtos selecionados para seu bebê — toque para comprar!'}
 </p>

 <div className="grid grid-cols-2 gap-3">
 {products.map((product) => (
 <div
 key={product.id}
 onClick={handleBuyProduct}
 className="cursor-pointer group rounded-xl border border-border bg-muted/30 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(330_85%_60%/0.15)]">
 {/* Image */}
 <div className="relative aspect-square bg-muted/50 overflow-hidden">
 <img
 src={product.image}
 alt={product.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"loading="lazy"/>
 {product.discount && (
 <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 font-bold">
 {product.discount}
 </Badge>
)}
 </div>

 {/* Info */}
 <div className="p-2.5 space-y-2">
 <p className="text-xs text-foreground font-medium line-clamp-2 leading-tight min-h-[2rem]">
 {product.name}
 </p>

 <div className="flex items-center justify-between">
 <span className="text-primary font-bold text-sm">
 {product.price}
 </span>
 </div>

 <div className="flex items-center gap-1 text-muted-foreground">
 <TrendingUp className="w-3 h-3"/>
 <span className="text-[10px]">{product.sold}</span>
 </div>

 <Button
 size="sm"className="w-full h-7 text-[11px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90"onClick={(e) => {
 e.stopPropagation();
 handleBuyProduct();
}}
 >
 <ShoppingBag className="w-3 h-3 mr-1"/>
 {isUSA?'Buy now':'Comprar'}
 </Button>
 </div>
 </div>
))}
 </div>

 <div className="mt-4 pt-3 border-t border-border text-center">
 <Button
 onClick={handleBuyProduct}
 variant="outline"className="w-full border-primary/30 text-primary hover:bg-primary/10 font-semibold">
 <ShoppingBag className="w-4 h-4 mr-2"/>
 {isUSA?'See all products in store':'Ver todos os produtos na loja'}
 </Button>
 </div>
 </Card>
);
};

export default ProductShowcase;
