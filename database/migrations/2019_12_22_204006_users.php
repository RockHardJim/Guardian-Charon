<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Users extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('surname');
            $table->string('email', 100)->unique();
            $table->string('cellphone', 100)->unique();
            $table->enum('status', ['active', 'suspended', 'unverified', 'banned'])->default('unverified');
            $table->string('password');
            $table->enum('role', ['administrator', 'security', 'user'])->default('administrator');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
