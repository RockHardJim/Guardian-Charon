<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Incidents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('identifier');
            $table->string('site');
            $table->string('user');
            $table->string('latitude');
            $table->string('longitude');
            $table->enum('type', ['theft', 'weather', 'power'])->default('theft');
            $table->enum('status', ['resolved', 'pending', 'closed'])->default('pending');
            $table->enum('live', ['draft', 'complete'])->default('draft');
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
        Schema::dropIfExists('incidents');
    }
}
