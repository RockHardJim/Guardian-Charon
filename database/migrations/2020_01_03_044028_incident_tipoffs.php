<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class IncidentTipoffs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incident_tipoffs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('serial');
            $table->string('incident');
            $table->string('user');
            $table->longText('description');
            $table->enum('status', ['acknowledged', 'investigating', 'finalized'])->default('acknowledged');
            $table->enum('report', ['yielded-results', 'dead-end', 'pending'])->default('pending');
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
        Schema::dropIfExists('incident_tipoffs');
    }
}
