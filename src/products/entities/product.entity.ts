import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty, ApiResponse, ApiResponseProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '898935af-5a93-4b9a-a2c4-67c73619c9ab',
        description: 'The unique identifier of the product',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ApiProperty({
        example: 'T-shirt',
        description: 'The title of the product',
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({
        example: 20.99,
        description: 'The price of the product',
        default: 0,
    })
    @Column('float', { default: 0 })
    price: number;


    @ApiProperty({
        example: 'This is a T-shirt',
        description: 'The description of the product',
        nullable: true,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;


    @ApiProperty({
        example: 't_shirt',
        description: 'The slug of the product',
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'The stock of the product',
        default: 0,
    })
    @Column('int', { default: 0 })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L', 'XL'],
        description: 'The sizes available for the product',
        isArray: true,
    })
    @Column('text', { array: true })
    sizes: string[];

    @ApiProperty({
        example: 'Women',
        description: 'Product gender'})
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['t-shirt', 'clothes', 'fashion'],
        description: 'The tags of the product',
        isArray: true})
    @Column('text', { array: true }) 
    tags: string[];


    @ApiProperty({
        example: 'https://www.example.com/image.jpg',
        description: 'The main image of the product',
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ApiProperty({
        example: '898935af-5a93-4b9a-a2c4-67c73619c9ab',
        description: 'The unique identifier of the user'
    })
    @ManyToOne(
        () => User,
        (user) => user.products
    )
    user: User;

    @BeforeInsert()
    checkSlug() {
        if (!this.slug) {
            this.slug = this.title;
        } 

        this.slug = this.slug
            .toLowerCase()
            .replace(' ', '_')
            .replace("'", '');
    }

    @BeforeUpdate()
    checkSlugOnUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replace(' ', '_')
            .replace("'", '');
    }
}
